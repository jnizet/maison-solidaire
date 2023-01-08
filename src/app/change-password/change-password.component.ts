import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User
} from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';

@Component({
  selector: 'ms-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    PageTitleDirective
  ]
})
export class ChangePasswordComponent {
  form = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  error = false;

  constructor(private auth: Auth, private router: Router) {}

  changePassword() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const user: User = this.auth.currentUser!;
    from(
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email!, formValue.currentPassword!)
      )
    )
      .pipe(switchMap(() => from(updatePassword(user, formValue.newPassword!))))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => (this.error = true)
      });
  }
}
