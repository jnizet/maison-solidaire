import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Activity, ActivityService } from '../activity.service';
import { switchMap } from 'rxjs';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { RouterLink } from '@angular/router';
import * as icons from '../../icon/icons';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { ConfirmService } from '../../confirm/confirm.service';
import { ToastService } from '../../toast/toast.service';
import { MarkdownDirective } from '../markdown.directive';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ms-future-activities',
  standalone: true,
  imports: [
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective,
    RouterLink,
    MarkdownDirective,
    DatePipe
  ],
  templateUrl: './future-activities.component.html',
  styleUrls: ['./future-activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FutureActivitiesComponent {
  activities: Signal<Array<Activity> | undefined>;
  user: Signal<CurrentUser | null>;

  icons = icons;

  constructor(
    private activityService: ActivityService,
    currentUserService: CurrentUserService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {
    this.user = currentUserService.currentUser;
    this.activities = toSignal(activityService.listFuture());
  }

  deleteActivity(activity: Activity) {
    this.confirmService
      .confirm({
        message: `Tu veux réellement supprimer l'activité "${activity.title}"\u00a0?`
      })
      .pipe(switchMap(() => this.activityService.deleteActivity(activity.id)))
      .subscribe(() => this.toastService.success('Activité supprimée'));
  }
}
