import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { AdministeredUser, UserService } from '../user.service';
import { combineLatest, distinctUntilChanged, map, startWith } from 'rxjs';
import * as icons from '../../icon/icons';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordLinkModalComponent } from '../reset-password-link-modal/reset-password-link-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ms-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective,
    ReactiveFormsModule
  ]
})
export class UsersComponent {
  users: Signal<Array<AdministeredUser> | undefined>;
  searchControl = this.fb.control('');
  icons = icons;

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
    private ngbModal: NgbModal
  ) {
    const filter$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      map(f => f.trim()),
      distinctUntilChanged()
    );

    this.users = toSignal(
      combineLatest([userService.listUsers(), filter$]).pipe(
        map(([users, filter]) => this.filterUsers(users, filter))
      )
    );
  }

  copyEmail(user: AdministeredUser) {
    return this.userService.copyEmail(user);
  }

  clearSearch() {
    this.searchControl.reset();
  }

  private filterUsers(users: Array<AdministeredUser>, filter: string): Array<AdministeredUser> {
    const lowercaseFilter = filter.toLowerCase();
    return users.filter(user => user.displayName.toLowerCase().includes(lowercaseFilter));
  }

  generateResetPasswordLink(user: AdministeredUser) {
    const modal = this.ngbModal.open(ResetPasswordLinkModalComponent);
    const modalComponent: ResetPasswordLinkModalComponent = modal.componentInstance;
    modalComponent.user.set(user);
  }
}
