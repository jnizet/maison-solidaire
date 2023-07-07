import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, Observable, of, switchMap } from 'rxjs';

export interface CurrentUser {
  admin: boolean;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUser$: Observable<CurrentUser | null>;

  constructor(private auth: Auth) {
    this.currentUser$ = authState(auth).pipe(
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
    );
  }

  getCurrentUser(): Observable<CurrentUser | null> {
    return this.currentUser$;
  }

  signOut() {
    return this.auth.signOut();
  }
}
