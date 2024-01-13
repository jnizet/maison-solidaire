import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as icons from '../../icon/icons';
import { Spinner } from '../../shared/spinner';
import { Router, RouterLink } from '@angular/router';
import { first, map, Observable, tap } from 'rxjs';
import { Contact, ContactCommand, ContactService } from '../../shared/contact.service';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ToastService } from '../../toast/toast.service';
import { FormControlValidationDirective } from '../../validation/form-control-validation.directive';
import { CurrentUserService } from '../../current-user.service';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  mode: 'create' | 'edit';
  editedContact?: Contact;
}

@Component({
  selector: 'ms-my-contact-edition',
  standalone: true,
  imports: [
    PageTitleDirective,
    ReactiveFormsModule,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    IconDirective,
    LoadingSpinnerComponent,
    RouterLink,
    SpinningIconComponent,
    AsyncPipe
  ],
  templateUrl: './my-contact-edition.component.html',
  styleUrls: ['./my-contact-edition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyContactEditionComponent {
  readonly form = this.fb.group({
    email: ['', Validators.email],
    phone: '',
    mobile: '',
    whatsapp: ''
  });
  readonly icons = icons;
  readonly vm$: Observable<ViewModel>;
  readonly saving = new Spinner();

  constructor(
    private router: Router,
    private contactService: ContactService,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService,
    private currentUserService: CurrentUserService
  ) {
    const user = currentUserService.currentUser()!;
    this.vm$ = contactService.findByName(user.displayName!).pipe(
      first(),
      tap(contact => {
        if (contact) {
          const formValue = {
            email: contact.email ?? '',
            phone: contact.phone ?? '',
            mobile: contact.mobile ?? '',
            whatsapp: contact.whatsapp ?? ''
          };

          this.form.setValue(formValue);
        }
      }),
      map(contact => ({
        mode: contact ? 'edit' : 'create',
        editedContact: contact
      }))
    );
  }

  save(vm: ViewModel) {
    if (this.form.invalid) {
      return;
    }

    const partialCommand: Omit<ContactCommand, 'name'> = this.form.getRawValue();
    const user = this.currentUserService.currentUser()!;
    const command: ContactCommand = { ...partialCommand, name: user.displayName! };
    const action$: Observable<Contact | void> =
      vm.mode === 'create'
        ? this.contactService.create(command)
        : this.contactService.update(vm.editedContact!.id, command);
    action$.pipe(this.saving.spinUntilFinalization()).subscribe(() => {
      this.router.navigate(['/contacts']);
      this.toastService.success('Coordonnées enregistrées');
    });
  }
}
