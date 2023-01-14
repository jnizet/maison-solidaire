import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { Auth, authState, User } from '@angular/fire/auth';
import {
  boxArrowInRight,
  calendar2WeekFill,
  emojiSmileFill,
  housesFill,
  infoCircleFill,
  peopleFill,
  personVcard
} from '../bootstrap-icons/bootstrap-icons';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { IconDirective } from '../icon/icon.directive';
import { RouterLink } from '@angular/router';
import { UsernamePipe } from '../username-pipe/username.pipe';
import { Activity, ActivityService } from '../activity/activity.service';

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
  imports: [NgIf, AsyncPipe, RouterLink, IconDirective, UsernamePipe, DatePipe, NgFor]
})
export class HomeComponent {
  vm$: Observable<ViewModel>;
  icons = {
    info: infoCircleFill,
    login: boxArrowInRight,
    welcome: emojiSmileFill,
    lodging: housesFill,
    association: peopleFill,
    contacts: personVcard,
    activities: calendar2WeekFill
  };

  constructor(auth: Auth, activityService: ActivityService) {
    this.vm$ = authState(auth).pipe(
      switchMap(user => {
        if (user) {
          return activityService
            .listFuture()
            .pipe(map(activities => ({ user, activities: activities.slice(0, 3) })));
        } else {
          return of({ user, activities: [] });
        }
      })
    );
  }
}
