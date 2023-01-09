import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc
} from '@angular/fire/firestore';
import { defer, map, Observable, shareReplay } from 'rxjs';

export interface Contact {
  id: string;
  name: string;
  userId?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
}

export type ContactCommand = Omit<Contact, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactCollection: CollectionReference<Contact>;
  private contacts$: Observable<Array<Contact>>;

  constructor(private firestore: Firestore) {
    this.contactCollection = collection(firestore, 'contacts') as CollectionReference<Contact>;
    this.contacts$ = collectionData<Contact>(
      query(this.contactCollection, orderBy('name', 'asc'))
    ).pipe(shareReplay(1));
  }

  list(): Observable<Array<Contact>> {
    return this.contacts$;
  }

  get(id: string): Observable<Contact | undefined> {
    return this.contacts$.pipe(map(contacts => contacts.find(c => c.id === id)));
  }

  create(command: ContactCommand): Observable<Contact> {
    const document = doc(this.contactCollection);
    const contact = this.createContact(document.id, command);
    return defer(() => setDoc(document, contact)).pipe(map(() => contact));
  }

  update(id: string, command: ContactCommand): Observable<void> {
    const document = doc(this.contactCollection, id);
    const contact = this.createContact(id, command);
    return defer(() => setDoc(document, contact));
  }

  private createContact(id: string, command: ContactCommand): Contact {
    const contact: Contact = {
      id,
      name: command.name
    };
    const properties: Array<keyof ContactCommand> = ['email', 'phone', 'mobile', 'whatsapp'];
    properties.forEach(prop => {
      if (command[prop]) {
        contact[prop] = command[prop] as string;
      }
    });
    return contact;
  }
}
