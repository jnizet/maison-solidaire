import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
  boxArrowInRight,
  calendar2WeekFill,
  housesFill,
  key,
  peopleFill,
  personCircle,
  personVcard,
  personWorkspace,
  power
} from '../bootstrap-icons/bootstrap-icons';
import { CurrentUser, CurrentUserService } from '../current-user.service';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbNavbar
} from '@ng-bootstrap/ng-bootstrap';
import { UsernamePipe } from '../username-pipe/username.pipe';
import { IconDirective } from '../icon/icon.directive';

@Component({
  selector: 'ms-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NgbCollapse,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbNavbar,
    UsernamePipe,
    IconDirective
  ]
})
export class NavbarComponent {
  expanded = false;
  vm$: Observable<{
    user: CurrentUser | null;
  }>;
  icons = {
    logout: power,
    login: boxArrowInRight,
    users: personWorkspace,
    user: personCircle,
    changePassword: key,
    lodging: housesFill,
    association: peopleFill,
    contacts: personVcard,
    activities: calendar2WeekFill
  };

  constructor(private currentUserService: CurrentUserService, private router: Router) {
    this.vm$ = currentUserService.getCurrentUser().pipe(map(user => ({ user })));
  }

  logout() {
    this.currentUserService.signOut();
    this.router.navigate(['/']);
  }

  collapse() {
    this.expanded = false;
  }

  toggle() {
    this.expanded = !this.expanded;
  }
}
