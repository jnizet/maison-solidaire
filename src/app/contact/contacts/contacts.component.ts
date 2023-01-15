import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, ContactService } from '../../shared/contact.service';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';
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

interface ViewModel {
  contacts: Array<Contact>;
  user: CurrentUser | null;
}

@Component({
  selector: 'ms-contacts',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleDirective,
    IconDirective,
    ContactComponent,
    RouterLink,
    LoadingSpinnerComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {
  vm$: Observable<ViewModel>;

  icons = icons;

  constructor(
    private contactService: ContactService,
    private currentUserService: CurrentUserService,
    private responsibilityService: ResponsibilityService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {
    this.vm$ = combineLatest([contactService.list(), currentUserService.getCurrentUser()]).pipe(
      map(([contacts, user]) => ({
        contacts: user?.admin ? contacts : contacts.filter(c => !this.isEmpty(c)),
        user
      }))
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

  trackById(index: number, contact: Contact) {
    return contact.id;
  }

  private isEmpty(contact: Contact) {
    return !(contact.email || contact.phone || contact.mobile || contact.whatsapp);
  }
}
