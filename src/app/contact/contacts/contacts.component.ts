import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact, ContactService } from '../../shared/contact.service';
import {
  combineLatest,
  distinctUntilChanged,
  first,
  map,
  Observable,
  startWith,
  switchMap
} from 'rxjs';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { IconDirective } from '../../icon/icon.directive';
import * as icons from '../../icon/icons';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { ResponsibilityService } from '../../shared/responsibility.service';
import { ConfirmService } from '../../confirm/confirm.service';
import { ToastService } from '../../toast/toast.service';
import { AsyncPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';

interface ViewModel {
  contacts: Array<Contact>;
  user: CurrentUser | null;
}

@Component({
  selector: 'ms-contacts',
  standalone: true,
  imports: [
    PageTitleDirective,
    IconDirective,
    ContactComponent,
    RouterLink,
    LoadingSpinnerComponent,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {
  vm$: Observable<ViewModel>;

  searchControl = this.fb.control('');

  icons = icons;

  constructor(
    private contactService: ContactService,
    private currentUserService: CurrentUserService,
    private responsibilityService: ResponsibilityService,
    private confirmService: ConfirmService,
    private toastService: ToastService,
    private fb: NonNullableFormBuilder
  ) {
    const filter$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      map(f => f.trim()),
      distinctUntilChanged()
    );
    this.vm$ = combineLatest([
      contactService.list(),
      toObservable(currentUserService.currentUser),
      filter$
    ]).pipe(
      map(([contacts, user, filter]) => {
        const displayableContacts = user?.admin ? contacts : contacts.filter(c => !this.isEmpty(c));
        const filteredContacts = this.filterContacts(displayableContacts, filter);
        return {
          contacts: filteredContacts,
          user
        };
      })
    );
  }

  deleteContact(contact: Contact) {
    this.responsibilityService
      .list()
      .pipe(
        first(),
        map(responsibilities =>
          responsibilities.filter(r => r.contacts.some(c => c.id === contact.id))
        ),
        switchMap(responsibilities => {
          let message = `Veux-tu vraiment supprimer le contact ${contact.name}\u00a0?`;
          if (responsibilities.length > 0) {
            const responsibilityNames = responsibilities.map(r => r.name).join(', ');
            message = `${contact.name} est responsables des éléments suivants: ${responsibilityNames}.\nVeux-tu malgré tout supprimer le contact ${contact.name}\u00a0?`;
          }
          return this.confirmService.confirm({ message });
        }),
        switchMap(() => this.contactService.deleteContact(contact.id))
      )
      .subscribe(() => this.toastService.success('Contact supprimé'));
  }

  clearSearch() {
    this.searchControl.reset();
  }

  private isEmpty(contact: Contact) {
    return !(contact.email || contact.phone || contact.mobile || contact.whatsapp);
  }

  private filterContacts(displayableContacts: Array<Contact>, filter: string): Array<Contact> {
    const lowercaseFilter = filter.toLowerCase();
    return displayableContacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercaseFilter)
    );
  }
}
