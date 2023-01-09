import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, ContactService } from '../../shared/contact.service';
import { combineLatest, map, Observable } from 'rxjs';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { IconDirective } from '../../icon/icon.directive';
import { pencilSquare, plusCircle } from '../../bootstrap-icons/bootstrap-icons';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { CurrentUser, CurrentUserService } from '../../current-user.service';

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

  icons = {
    addContact: plusCircle,
    edit: pencilSquare
  };

  constructor(
    private contactService: ContactService,
    private currentUserService: CurrentUserService
  ) {
    this.vm$ = combineLatest([contactService.list(), currentUserService.getCurrentUser()]).pipe(
      map(([contacts, user]) => ({ contacts, user }))
    );
  }
}
