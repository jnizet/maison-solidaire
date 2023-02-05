import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CurrentUser, CurrentUserService } from '../current-user.service';
import { AsyncPipe, NgIf, ViewportScroller } from '@angular/common';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbNavbar
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
    NgIf,
    AsyncPipe,
    RouterLink,
    NgbCollapse,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbNavbar,
    IconDirective
  ]
})
export class NavbarComponent {
  expanded = false;
  vm$: Observable<{
    user: CurrentUser | null;
  }>;
  icons = icons;

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    viewportScroller: ViewportScroller,
    elementRef: ElementRef<HTMLElement>
  ) {
    this.vm$ = currentUserService.getCurrentUser().pipe(map(user => ({ user })));
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
