import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as icons from '../../icon/icons';
import { Spinner } from '../../shared/spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { first, map, Observable, of, switchMap, tap } from 'rxjs';
import { Contact, ContactCommand, ContactService } from '../../shared/contact.service';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ToastService } from '../../toast/toast.service';
import { FormControlValidationDirective } from '../../validation/form-control-validation.directive';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';
import { AsyncPipe, NgIf } from '@angular/common';

interface ViewModel {
  mode: 'create' | 'edit';
  editedContact?: Contact;
}

@Component({
  selector: 'ms-contact-edition',
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
    NgIf,
    AsyncPipe
  ],
  templateUrl: './contact-edition.component.html',
  styleUrls: ['./contact-edition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactEditionComponent {
  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    phone: '',
    mobile: '',
    whatsapp: ''
  });

  readonly vm$: Observable<ViewModel>;
  readonly icons = icons;
  readonly saving = new Spinner();

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService
  ) {
    this.vm$ = route.paramMap.pipe(
      map(paramMap => paramMap.get('contactId')),
      switchMap(contactId => (contactId ? contactService.get(contactId) : of(undefined))),
      first(),
      tap(contact => {
        if (contact) {
          const formValue = {
            name: contact.name,
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

    const command: ContactCommand = this.form.getRawValue();
    const result$: Observable<unknown> =
      vm.mode === 'create'
        ? this.contactService.create(command)
        : this.contactService.update(vm.editedContact!.id, command);
    result$.pipe(this.saving.spinUntilFinalization()).subscribe(() => {
      this.router.navigate(['/contacts']);
      this.toastService.success(vm.mode === 'create' ? 'Contact créé' : 'Contact modifié');
    });
  }
}
