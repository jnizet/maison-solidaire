import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdministeredUser, AdministeredUserCommand, UserService } from '../user.service';
import { first, map, Observable, of, switchMap, tap } from 'rxjs';
import { Spinner } from '../../shared/spinner';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../../validation/form-control-validation.directive';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCreatedModalComponent } from '../user-created-modal/user-created-modal.component';
import { AsyncPipe, NgIf } from '@angular/common';
import * as icons from '../../icon/icons';

interface ViewModel {
  mode: 'create' | 'edit';
  editedUser: AdministeredUser | null;
}

@Component({
  selector: 'ms-user-edition',
  templateUrl: './user-edition.component.html',
  styleUrls: ['./user-edition.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditionComponent {
  readonly form = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    admin: new FormControl(false),
    disabled: new FormControl(false)
  });

  vm$: Observable<ViewModel>;

  readonly icons = icons;
  readonly saving = new Spinner();

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    this.vm$ = route.paramMap.pipe(
      map(paramMap => paramMap.get('uid')),
      switchMap(uid => (uid ? userService.get(uid) : of(null))),
      first(),
      tap(user => {
        if (user) {
          const formValue = {
            displayName: user.displayName,
            email: user.email,
            admin: user.admin,
            disabled: user.disabled
          };

          this.form.setValue(formValue);
        }
      }),
      map(user => ({
        mode: user ? 'edit' : 'create',
        editedUser: user
      }))
    );
  }

  save(vm: ViewModel) {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const command: AdministeredUserCommand = {
      email: formValue.email!,
      displayName: formValue.displayName!,
      disabled: formValue.disabled!,
      admin: formValue.admin!
    };
    const result$: Observable<unknown> =
      vm.mode === 'create'
        ? this.userService.create(command)
        : this.userService.update(vm.editedUser!.uid, command);
    result$.pipe(this.saving.spinUntilFinalization()).subscribe(() => {
      this.router.navigate(['/users']);
      if (vm.mode === 'create') {
        const modalRef = this.modalService.open(UserCreatedModalComponent);
        (modalRef.componentInstance as UserCreatedModalComponent).userName = formValue.displayName!;
      }
    });
  }
}
