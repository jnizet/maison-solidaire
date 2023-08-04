import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { combineLatest, defer, from, map, Observable, shareReplay } from 'rxjs';
import { Contact, ContactService } from './contact.service';
import { Injectable } from '@angular/core';

type ResponsibilitySlug = string;

interface PersistentResponsibility {
  id: string;
  slug: ResponsibilitySlug;
  name: string;
  contacts: Array<string>;
}

export interface Responsibility {
  id: string;
  slug: ResponsibilitySlug;
  name: string;
  contacts: Array<Contact>;
}

export type ResponsibilityCommand = Omit<PersistentResponsibility, 'id' | 'slug' | 'name'>;

export const LODGING: ResponsibilitySlug = 'lodging';
export const FRENCH: ResponsibilitySlug = 'french';
export const PHONES: ResponsibilitySlug = 'phones';
export const TRANSPORT: ResponsibilitySlug = 'transport';
export const FOOD: ResponsibilitySlug = 'food';
export const CLOTHES: ResponsibilitySlug = 'clothes';
export const HEALTH: ResponsibilitySlug = 'health';
export const COORDINATION: ResponsibilitySlug = 'coordination';
export const COUNCIL: ResponsibilitySlug = 'council';

@Injectable({
  providedIn: 'root'
})
export class ResponsibilityService {
  private responsibilityCollection: CollectionReference<PersistentResponsibility>;
  private responsibilities$: Observable<Array<Responsibility>>;

  constructor(
    private firestore: Firestore,
    private contactService: ContactService
  ) {
    this.responsibilityCollection = collection(
      firestore,
      'responsibilities'
    ) as CollectionReference<PersistentResponsibility>;
    const persistentResponsibilities$ = collectionData<PersistentResponsibility>(
      query(this.responsibilityCollection, orderBy('name', 'asc'))
    );
    const contacts$ = contactService.list();

    this.responsibilities$ = combineLatest([persistentResponsibilities$, contacts$]).pipe(
      map(([persistentResponsibilities, contacts]) =>
        persistentResponsibilities.map(persistentResponsibility => ({
          id: persistentResponsibility.id,
          slug: persistentResponsibility.slug,
          name: persistentResponsibility.name,
          contacts: persistentResponsibility.contacts
            .map(contactId => contacts.find(c => c.id === contactId))
            .filter((c): c is Contact => !!c)
        }))
      ),
      shareReplay(1)
    );
  }

  list(): Observable<Array<Responsibility>> {
    return this.responsibilities$;
  }

  getBySlug(slug: ResponsibilitySlug): Observable<Responsibility> {
    return this.responsibilities$.pipe(
      map(responsibilities => responsibilities.find(c => c.slug === slug)!)
    );
  }

  update(id: string, command: ResponsibilityCommand) {
    const document = doc(this.responsibilityCollection, id);
    return defer(() => from(updateDoc(document, command)));
  }
}
