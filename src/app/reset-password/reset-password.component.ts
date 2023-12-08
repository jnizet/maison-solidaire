import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as icons from '../icon/icons';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { FormControlValidationDirective } from '../validation/form-control-validation.directive';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { IconDirective } from '../icon/icon.directive';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  emailSent: boolean;
  error: boolean;
}

@Component({
  selector: 'ms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    PageTitleDirective,
    IconDirective,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  private readonly vmSubject = new BehaviorSubject<ViewModel>({
    error: false,
    emailSent: false
  });
  readonly vm$: Observable<ViewModel> = this.vmSubject.asObservable();
  readonly icons = icons;

  constructor(
    private route: ActivatedRoute,
    private auth: Auth
  ) {
    this.form.setValue({ email: route.snapshot.queryParamMap.get('email') || '' });
  }

  sendEmail() {
    if (this.form.invalid) {
      return;
    }

    from(sendPasswordResetEmail(this.auth, this.form.value.email!)).subscribe({
      next: () => this.vmSubject.next({ ...this.vmSubject.value, emailSent: true }),
      error: () => this.vmSubject.next({ ...this.vmSubject.value, error: true })
    });
  }
}
