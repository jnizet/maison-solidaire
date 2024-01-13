import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { ResponsibilityComponent } from '../../shared/responsibility/responsibility.component';
import {
  COORDINATION,
  Responsibility,
  ResponsibilityService
} from '../../shared/responsibility.service';
import { combineLatest, Observable } from 'rxjs';
import { WeeklySchedule, WeeklyScheduleService } from '../weekly-schedule.service';
import { WeekPipe } from '../week.pipe';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { RouterLink } from '@angular/router';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { StorageService } from '../../shared/storage.service';
import * as icons from '../../icon/icons';
import { IconDirective } from '../../icon/icon.directive';
import { toObservable } from '@angular/core/rxjs-interop';

interface ViewModel {
  coordination: Responsibility;
  weeklySchedules: Array<WeeklySchedule>;
  user: CurrentUser | null;
  conventionUrl: string;
}

@Component({
  selector: 'ms-volunteering',
  standalone: true,
  imports: [
    ContactComponent,
    ResponsibilityComponent,
    AsyncPipe,
    WeekPipe,
    RouterLink,
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective
  ],
  templateUrl: './volunteering.component.html',
  styleUrls: ['./volunteering.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VolunteeringComponent {
  readonly vm$: Observable<ViewModel>;

  readonly icons = icons;

  constructor(
    responsibilityService: ResponsibilityService,
    weeklyScheduleService: WeeklyScheduleService,
    currentUserService: CurrentUserService,
    storageService: StorageService
  ) {
    this.vm$ = combineLatest({
      coordination: responsibilityService.getBySlug(COORDINATION),
      weeklySchedules: weeklyScheduleService.listFutureSchedules(),
      user: toObservable(currentUserService.currentUser),
      conventionUrl: storageService.downloadUrl('charte-benevoles.pdf')
    });
  }
}
