import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { ResponsibilityComponent } from '../../shared/responsibility/responsibility.component';
import {
  COORDINATION,
  Responsibility,
  ResponsibilityService
} from '../../shared/responsibility.service';
import { combineLatest, map, Observable } from 'rxjs';
import { WeeklySchedule, WeeklyScheduleService } from '../weekly-schedule.service';
import { WeekPipe } from '../week.pipe';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { RouterLink } from '@angular/router';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

interface ViewModel {
  coordination: Responsibility;
  weeklySchedules: Array<WeeklySchedule>;
  user: CurrentUser | null;
}

@Component({
  selector: 'ms-volunteering',
  standalone: true,
  imports: [
    ContactComponent,
    ResponsibilityComponent,
    AsyncPipe,
    NgIf,
    WeekPipe,
    NgFor,
    RouterLink,
    PageTitleDirective,
    LoadingSpinnerComponent
  ],
  templateUrl: './volunteering.component.html',
  styleUrls: ['./volunteering.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VolunteeringComponent {
  vm$: Observable<ViewModel>;

  constructor(
    responsibilityService: ResponsibilityService,
    weeklyScheduleService: WeeklyScheduleService,
    currentUserService: CurrentUserService
  ) {
    const coordination$ = responsibilityService.getBySlug(COORDINATION);
    const weeklySchedules$ = weeklyScheduleService.listFutureSchedules();
    const currentUser$ = currentUserService.getCurrentUser();
    this.vm$ = combineLatest([coordination$, weeklySchedules$, currentUser$]).pipe(
      map(([coordination, weeklySchedules, user]) => ({ coordination, weeklySchedules, user }))
    );
  }
}
