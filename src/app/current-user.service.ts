import { Injectable, Signal } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface CurrentUser {
  admin: boolean;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  readonly currentUser: Signal<CurrentUser | null>;

  constructor(private auth: Auth) {
    this.currentUser = toSignal(
      authState(auth).pipe(
        switchMap(user => {
          if (user) {
            return from(user.getIdTokenResult()).pipe(
              map(token => ({
                user,
                displayName: token.claims['displayName'] as string,
                admin: !!token.claims['admin']
              }))
            );
          } else {
            return of(null);
          }
        })
      ),
      { initialValue: null }
    );
  }

  signOut() {
    return this.auth.signOut();
  }
}
