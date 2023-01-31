import { Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    component: ContactsComponent
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./contact-edition/contact-edition.component').then(m => m.ContactEditionComponent)
  },
  {
    path: ':contactId/edit',
    loadComponent: () =>
      import('./contact-edition/contact-edition.component').then(m => m.ContactEditionComponent)
  }
];
