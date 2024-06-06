import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as icons from '../../icon/icons';
import { Spinner } from '../../shared/spinner';
import { Router, RouterLink } from '@angular/router';
import { filter, first, map, Observable, switchMap, tap } from 'rxjs';
import { Contact, ContactCommand, ContactService } from '../../shared/contact.service';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ToastService } from '../../toast/toast.service';
import { FormControlValidationDirective } from '../../validation/form-control-validation.directive';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';
import { toSignal } from '@angular/core/rxjs-interop';

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
    SpinningIconComponent
  ],
  templateUrl: './my-contact-edition.component.html',
  styleUrls: ['./my-contact-edition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyContactEditionComponent {
  readonly form = inject(NonNullableFormBuilder).group({
    email: ['', Validators.email],
    phone: '',
    mobile: '',
    whatsapp: ''
  });
  readonly icons = icons;
  readonly vm: Signal<ViewModel | undefined>;
  readonly saving = new Spinner();

  constructor(
    private router: Router,
    private contactService: ContactService,
    private toastService: ToastService,
    private currentUserService: CurrentUserService
  ) {
    this.vm = toSignal(
      currentUserService.currentUser$.pipe(
        filter((user: CurrentUser | null): user is CurrentUser => !!user),
        switchMap(user => contactService.findByName(user.displayName!)),
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
      )
    );
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const partialCommand: Omit<ContactCommand, 'name'> = this.form.getRawValue();
    const user = this.currentUserService.currentUser()!;
    const command: ContactCommand = { ...partialCommand, name: user.displayName! };
    const action$: Observable<Contact | void> =
      this.vm()!.mode === 'create'
        ? this.contactService.create(command)
        : this.contactService.update(this.vm()!.editedContact!.id, command);
    action$.pipe(this.saving.spinUntilFinalization()).subscribe(() => {
      this.router.navigate(['/contacts']);
      this.toastService.success('Coordonnées enregistrées');
    });
  }
}
