import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { addWeeks, formatISO, parseISO, startOfISOWeek } from 'date-fns';
import { first, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { StorageService } from '../shared/storage.service';

// a week is identified by the start of its ISO week, i.e. the ISO date of its first Monday
export type Week = string;

interface PersistentWeeklySchedule {
  id: string;
  week: Week;
  path: string;
}

export interface WeeklySchedule extends PersistentWeeklySchedule {
  fileUrl: string;
}

export interface WeeklyScheduleCommand {
  week: Week;
}

@Injectable({
  providedIn: 'root'
})
export class WeeklyScheduleService {
  private weeklyScheduleCollection: CollectionReference<PersistentWeeklySchedule>;

  constructor(private firestore: Firestore, private storageService: StorageService) {
    this.weeklyScheduleCollection = collection(
      firestore,
      'weekly-schedules'
    ) as CollectionReference<PersistentWeeklySchedule>;
  }

  private currentWeek(): Week {
    const today = new Date();
    return formatISO(startOfISOWeek(today), { representation: 'date' });
  }

  nextWeeks(): Array<Week> {
    const currentWeek = parseISO(this.currentWeek());
    const weeks: Array<Week> = [];
    for (let i = 0; i < 4; i++) {
      const week = formatISO(addWeeks(currentWeek, i), { representation: 'date' });
      weeks.push(week);
    }
    return weeks;
  }

  listFutureSchedules(): Observable<Array<WeeklySchedule>> {
    const currentWeek = this.currentWeek();
    return collectionData(
      query(this.weeklyScheduleCollection, where('week', '>=', currentWeek), orderBy('week'))
    ).pipe(
      switchMap(persistentSchedules => {
        if (persistentSchedules.length === 0) {
          return of([]);
        }
        const fileUrls$ = forkJoin(
          persistentSchedules.map(ps => this.storageService.downloadUrl(ps.path))
        );
        return fileUrls$.pipe(
          map(fileUrls =>
            fileUrls.map((fileUrl, index) => ({ ...persistentSchedules[index], fileUrl }))
          )
        );
      })
    );
  }

  uploadSchedule(file: File, command: WeeklyScheduleCommand): Observable<void> {
    const existingSchedule$: Observable<PersistentWeeklySchedule | undefined> = collectionData(
      query(this.weeklyScheduleCollection, where('week', '==', command.week))
    ).pipe(
      first(),
      map(schedules => schedules[0])
    );

    const path = `weekly-schedules/${command.week}/${file.name}`;
    return this.storageService.upload(path, file).pipe(
      switchMap(() => existingSchedule$),
      switchMap(existingSchedule => {
        const docRef = existingSchedule
          ? doc(this.weeklyScheduleCollection, existingSchedule.id)
          : doc(this.weeklyScheduleCollection);
        const schedule: PersistentWeeklySchedule = {
          id: docRef.id,
          week: command.week,
          path
        };
        return setDoc(docRef, schedule);
      })
    );
  }
}
