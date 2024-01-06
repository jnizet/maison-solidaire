import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdministeredUser, UserService } from '../user.service';
import { combineLatest, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import * as icons from '../../icon/icons';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordLinkModalComponent } from '../reset-password-link-modal/reset-password-link-modal.component';

@Component({
  selector: 'ms-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective,
    ReactiveFormsModule
  ]
})
export class UsersComponent {
  users$: Observable<Array<AdministeredUser>>;
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

    this.users$ = combineLatest([userService.listUsers(), filter$]).pipe(
      map(([users, filter]) => this.filterUsers(users, filter))
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
    modalComponent.user = user;
  }
}
