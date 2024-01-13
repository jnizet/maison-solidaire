import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { ResponsibilityComponent } from '../../shared/responsibility/responsibility.component';
import {
  COORDINATION,
  Responsibility,
  ResponsibilityService
} from '../../shared/responsibility.service';
import { combineLatest } from 'rxjs';
import { WeeklySchedule, WeeklyScheduleService } from '../weekly-schedule.service';
import { WeekPipe } from '../week.pipe';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { RouterLink } from '@angular/router';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { StorageService } from '../../shared/storage.service';
import * as icons from '../../icon/icons';
import { IconDirective } from '../../icon/icon.directive';
import { toSignal } from '@angular/core/rxjs-interop';

interface ViewModel {
  coordination: Responsibility;
  weeklySchedules: Array<WeeklySchedule>;
  conventionUrl: string;
}

@Component({
  selector: 'ms-volunteering',
  standalone: true,
  imports: [
    ContactComponent,
    ResponsibilityComponent,
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
  readonly vm: Signal<ViewModel | undefined>;
  readonly user: Signal<CurrentUser | null>;
  readonly icons = icons;

  constructor(
    responsibilityService: ResponsibilityService,
    weeklyScheduleService: WeeklyScheduleService,
    currentUserService: CurrentUserService,
    storageService: StorageService
  ) {
    this.user = currentUserService.currentUser;
    this.vm = toSignal(
      combineLatest({
        coordination: responsibilityService.getBySlug(COORDINATION),
        weeklySchedules: weeklyScheduleService.listFutureSchedules(),
        conventionUrl: storageService.downloadUrl('charte-benevoles.pdf')
      })
    );
  }
}
