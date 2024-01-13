import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { Auth, authState, User } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { IconDirective } from '../icon/icon.directive';
import { RouterLink } from '@angular/router';
import { Activity, ActivityService } from '../activity/activity.service';
import * as icons from '../icon/icons';
import { toSignal } from '@angular/core/rxjs-interop';

interface ViewModel {
  user: User | null;
  activities: Array<Activity>;
}

@Component({
  selector: 'ms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, IconDirective, DatePipe]
})
export class HomeComponent {
  vm: Signal<ViewModel | undefined>;
  icons = icons;

  constructor(auth: Auth, activityService: ActivityService) {
    this.vm = toSignal(
      authState(auth).pipe(
        switchMap(user => {
          if (user) {
            return activityService
              .listFuture()
              .pipe(map(activities => ({ user, activities: activities.slice(0, 3) })));
          } else {
            return of({ user, activities: [] });
          }
        })
      )
    );
  }
}
