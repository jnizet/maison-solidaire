import { ChangeDetectionStrategy, Component, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Auth,
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode
} from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, from, map, of, Subject, switchMap } from 'rxjs';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { toSignal } from '@angular/core/rxjs-interop';

interface ViewModel {
  email: string | null;
  verificationError: boolean;
}

@Component({
  selector: 'ms-email-action',
  templateUrl: './email-action.component.html',
  styleUrls: ['./email-action.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    PageTitleDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailActionComponent {
  private actionCode: string;
  readonly form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  readonly vm: Signal<ViewModel | undefined>;
  resetError = signal(false);
  readonly transitionsSubject = new Subject<(vm: ViewModel) => ViewModel>();

  constructor(
    route: ActivatedRoute,
    private auth: Auth,
    private router: Router
  ) {
    const params = route.snapshot.queryParamMap;
    const mode = params.get('mode');
    if (mode !== 'resetPassword') {
      throw new Error(`unhandled mode: ${mode}`);
    }
    this.actionCode = params.get('oobCode')!;

    this.vm = toSignal(
      from(verifyPasswordResetCode(auth, this.actionCode)).pipe(
        map(email => ({
          email,
          verificationError: false
        })),
        catchError(() =>
          of({
            email: null,
            verificationError: true
          } as ViewModel)
        )
      )
    );
  }

  resetPassword() {
    if (this.form.invalid) {
      return;
    }

    // Save the new password.
    const password = this.form.value.password!;
    from(confirmPasswordReset(this.auth, this.actionCode, password))
      .pipe(
        switchMap(() => from(signInWithEmailAndPassword(this.auth, this.vm()!.email!, password)))
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.resetError.set(true)
      });
  }
}
