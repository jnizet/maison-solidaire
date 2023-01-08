import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Auth, authState, User } from '@angular/fire/auth';
import {
  boxArrowInRight,
  emojiSmileFill,
  housesFill,
  infoCircleFill,
  peopleFill
} from '../bootstrap-icons/bootstrap-icons';
import { AsyncPipe, NgIf } from '@angular/common';
import { IconDirective } from '../icon/icon.directive';
import { RouterLink } from '@angular/router';
import { UsernamePipe } from '../username-pipe/username.pipe';

@Component({
  selector: 'ms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, IconDirective, UsernamePipe]
})
export class HomeComponent {
  vm$: Observable<{ user: User | null }>;
  icons = {
    info: infoCircleFill,
    login: boxArrowInRight,
    welcome: emojiSmileFill,
    lodging: housesFill,
    association: peopleFill
  };

  constructor(auth: Auth) {
    this.vm$ = authState(auth).pipe(map(user => ({ user })));
  }
}
