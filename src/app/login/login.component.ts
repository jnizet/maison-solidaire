import { Component } from '@angular/core';
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
import { NgIf } from '@angular/common';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { google } from '../bootstrap-icons/bootstrap-icons';
import { IconDirective } from '../icon/icon.directive';

@Component({
  selector: 'ms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    PageTitleDirective,
    IconDirective
  ]
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  loginError = false;
  googleLoginError = false;

  icons = {
    google: google
  };

  constructor(private auth: Auth, private router: Router) {}

  login() {
    if (this.form.invalid) {
      return;
    }

    const credentials = this.form.value;
    from(
      signInWithEmailAndPassword(this.auth, credentials.email!, credentials.password!)
    ).subscribe({
      next: () => {
        this.loginError = false;
        this.router.navigate(['/']);
      },
      error: () => (this.loginError = true)
    });
  }

  async googleLogin() {
    try {
      const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const token = await userCredential.user.getIdTokenResult();
      if (!(token.claims as any).user) {
        this.googleLoginError = true;
        await deleteUser(userCredential.user);
      } else {
        this.googleLoginError = false;
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.googleLoginError = true;
    }
  }
}
