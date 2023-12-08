import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Auth,
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode
} from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, from, map, Observable, of, scan, startWith, Subject, switchMap } from 'rxjs';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  email: string | null;
  verificationError: boolean;
  resetError: boolean;
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
    PageTitleDirective,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailActionComponent {
  private actionCode: string;
  readonly form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  readonly vm$: Observable<ViewModel>;
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

    this.vm$ = from(verifyPasswordResetCode(auth, this.actionCode)).pipe(
      map(email => ({
        email,
        verificationError: false,
        resetError: false
      })),
      catchError(() =>
        of({
          email: null,
          verificationError: true,
          resetError: false
        } as ViewModel)
      ),
      switchMap(vm =>
        this.transitionsSubject.pipe(
          startWith(vm => vm),
          scan((vm, transform) => transform(vm), vm)
        )
      )
    );
  }

  resetPassword(vm: ViewModel) {
    if (this.form.invalid) {
      return;
    }

    // Save the new password.
    const password = this.form.value.password!;
    from(confirmPasswordReset(this.auth, this.actionCode, password))
      .pipe(switchMap(() => from(signInWithEmailAndPassword(this.auth, vm.email!, password))))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.transitionsSubject.next(vm => ({ ...vm, resetError: true }))
      });
  }
}
