import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Activity, ActivityService } from '../activity.service';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { RouterLink } from '@angular/router';
import * as icons from '../../icon/icons';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { ConfirmService } from '../../confirm/confirm.service';
import { ToastService } from '../../toast/toast.service';
import { MarkdownDirective } from '../markdown.directive';
import { AsyncPipe, DatePipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

interface ViewModel {
  activities: Array<Activity>;
  user: CurrentUser | null;
}

@Component({
  selector: 'ms-future-activities',
  standalone: true,
  imports: [
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective,
    RouterLink,
    MarkdownDirective,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './future-activities.component.html',
  styleUrls: ['./future-activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FutureActivitiesComponent {
  vm$: Observable<ViewModel>;

  icons = icons;

  constructor(
    private activityService: ActivityService,
    currentUserService: CurrentUserService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {
    this.vm$ = combineLatest({
      activities: activityService.listFuture(),
      user: toObservable(currentUserService.currentUser)
    });
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
