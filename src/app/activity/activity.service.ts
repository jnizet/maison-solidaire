import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { defer, from, map, Observable } from 'rxjs';

export interface Activity {
  id: string;
  title: string;
  date: string; // ISO date
  description: string; // markdown
}

export type ActivityCommand = Omit<Activity, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activityCollection: CollectionReference<Activity>;

  constructor(private firestore: Firestore) {
    this.activityCollection = collection(firestore, 'activities') as CollectionReference<Activity>;
  }

  listFuture(): Observable<Array<Activity>> {
    const today = new Date().toISOString().slice(0, 10);
    return collectionData<Activity>(
      query(this.activityCollection, where('date', '>=', today), orderBy('date', 'asc'))
    );
  }

  get(id: string): Observable<Activity> {
    return docData(doc(this.activityCollection, id)).pipe(
      map(activity => {
        if (!activity) {
          throw new Error(`No activity with ID ${id}`);
        }
        return activity;
      })
    );
  }

  create(command: ActivityCommand): Observable<Activity> {
    const document = doc(this.activityCollection);
    const activity: Activity = { ...command, id: document.id };
    return defer(() => setDoc(document, activity)).pipe(map(() => activity));
  }

  update(id: string, command: ActivityCommand): Observable<void> {
    const document = doc(this.activityCollection, id);
    const activity: Activity = { ...command, id };
    return defer(() => setDoc(document, activity));
  }

  deleteActivity(id: string): Observable<void> {
    return defer(() => {
      const document = doc(this.activityCollection, id);
      return from(deleteDoc(document));
    });
  }
}
