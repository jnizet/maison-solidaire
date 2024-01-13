import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Auth,
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from '@angular/fire/auth';
import { from } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { IconDirective } from '../icon/icon.directive';
import * as icons from '../icon/icons';

@Component({
  selector: 'ms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    PageTitleDirective,
    IconDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  loginError = signal(false);
  googleLoginError = signal(false);

  readonly icons = icons;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  login() {
    if (this.form.invalid) {
      return;
    }

    const credentials = this.form.value;
    from(
      signInWithEmailAndPassword(this.auth, credentials.email!, credentials.password!)
    ).subscribe({
      next: () => {
        this.loginError.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loginError.set(true);
      }
    });
  }

  async googleLogin() {
    try {
      const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const token = await userCredential.user.getIdTokenResult();
      if (!(token.claims as any).user) {
        this.googleLoginError.set(true);
        await deleteUser(userCredential.user);
      } else {
        this.googleLoginError.set(false);
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.googleLoginError.set(true);
    }
  }
}
