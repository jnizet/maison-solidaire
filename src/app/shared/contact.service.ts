import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  Firestore,
  orderBy,
  query
} from '@angular/fire/firestore';
import { map, Observable, shareReplay } from 'rxjs';

export interface Contact {
  id: string;
  name: string;
  userId?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
}

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
}
