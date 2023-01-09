import { Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactEditionComponent } from './contact-edition/contact-edition.component';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    component: ContactsComponent
  },
  {
    path: 'new',
    component: ContactEditionComponent
  },
  {
    path: ':contactId/edit',
    component: ContactEditionComponent
  }
];
