import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Auth,
  deleteUser,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { IconDirective } from '../icon/icon.directive';
import * as icons from '../icon/icons';

interface ViewModel {
  loginError: boolean;
  googleLoginError: boolean;
}

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
    IconDirective,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  private readonly vmSubject = new BehaviorSubject<ViewModel>({
    loginError: false,
    googleLoginError: false
  });
  readonly vm$: Observable<ViewModel> = this.vmSubject.asObservable();

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
        this.vmSubject.next({ ...this.vmSubject.value, loginError: false });
        this.router.navigate(['/']);
      },
      error: () => {
        this.vmSubject.next({ ...this.vmSubject.value, loginError: true });
      }
    });
  }

  async googleLogin() {
    try {
      const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const token = await userCredential.user.getIdTokenResult();
      if (!(token.claims as any).user) {
        this.vmSubject.next({ ...this.vmSubject.value, googleLoginError: true });
        await deleteUser(userCredential.user);
      } else {
        this.vmSubject.next({ ...this.vmSubject.value, googleLoginError: false });
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.vmSubject.next({ ...this.vmSubject.value, googleLoginError: true });
    }
  }
}
