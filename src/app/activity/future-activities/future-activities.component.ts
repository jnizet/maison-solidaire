import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity, ActivityService } from '../activity.service';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { RouterLink } from '@angular/router';
import * as icons from '../../icon/icons';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { ConfirmService } from '../../confirm/confirm.service';
import { ToastService } from '../../toast/toast.service';
import { MarkdownDirective } from '../markdown.directive';

interface ViewModel {
  activities: Array<Activity>;
  user: CurrentUser | null;
}

@Component({
  selector: 'ms-future-activities',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective,
    RouterLink,
    MarkdownDirective
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
    this.vm$ = combineLatest([
      activityService.listFuture(),
      currentUserService.getCurrentUser()
    ]).pipe(map(([activities, user]) => ({ activities, user })));
  }

  deleteActivity(activity: Activity) {
    this.confirmService
      .confirm({
        message: `Tu veux réellement supprimer l'activité "${activity.title}"\u00a0?`
      })
      .pipe(switchMap(() => this.activityService.deleteActivity(activity.id)))
      .subscribe(() => this.toastService.success('Activité supprimée'));
  }

  trackById(index: number, activity: Activity) {
    return activity.id;
  }
}
