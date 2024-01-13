import { ChangeDetectionStrategy, Component, ElementRef, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrentUser, CurrentUserService } from '../current-user.service';
import { ViewportScroller } from '@angular/common';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from '@ng-bootstrap/ng-bootstrap';
import { IconDirective } from '../icon/icon.directive';
import * as icons from '../icon/icons';

@Component({
  selector: 'ms-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    NgbCollapse,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    IconDirective
  ]
})
export class NavbarComponent {
  expanded = false;
  user: Signal<CurrentUser | null>;
  icons = icons;

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    viewportScroller: ViewportScroller,
    elementRef: ElementRef<HTMLElement>
  ) {
    this.user = currentUserService.currentUser;
    viewportScroller.setOffset(() => [0, elementRef?.nativeElement?.offsetHeight ?? 0]);
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
