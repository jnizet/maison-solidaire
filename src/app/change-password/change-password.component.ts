import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { ToastService } from '../toast/toast.service';

interface ViewModel {
  error: boolean;
}

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
    PageTitleDirective,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  readonly form = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  private readonly vmSubject = new BehaviorSubject<ViewModel>({ error: false });
  readonly vm$: Observable<ViewModel> = this.vmSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router,
    private toastService: ToastService
  ) {}

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
        next: () => {
          this.router.navigate(['/']);
          this.toastService.success('Mot de passe modifié');
        },
        error: () => this.vmSubject.next({ ...this.vmSubject.value, error: true })
      });
  }
}
