import { Injectable } from '@angular/core';
import { defer, from, map, Observable } from 'rxjs';
import { Functions, httpsCallable } from '@angular/fire/functions';
import * as icons from '../icon/icons';
import { ToastService } from '../toast/toast.service';

export interface AdministeredUser {
  uid: string;
  email: string;
  displayName: string;
  disabled: boolean;
  admin: boolean;
}

export type AdministeredUserCommand = Omit<AdministeredUser, 'uid'>;

export interface ResetPasswordLinkInfo {
  resetPasswordLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private functions: Functions,
    private toastService: ToastService
  ) {}

  listUsers(): Observable<Array<AdministeredUser>> {
    const listUsers = httpsCallable<void, Array<AdministeredUser>>(this.functions, 'listUsers');
    return defer(() => listUsers()).pipe(
      map(r =>
        r.data.sort((c1, c2) => new Intl.Collator('fr').compare(c1.displayName, c2.displayName))
      )
    );
  }

  get(uid: string): Observable<AdministeredUser> {
    const getUser = httpsCallable<string, AdministeredUser>(this.functions, 'getUser');
    return defer(() => getUser(uid)).pipe(map(r => r.data));
  }

  create(command: AdministeredUserCommand): Observable<AdministeredUser> {
    const createUser = httpsCallable<AdministeredUserCommand, AdministeredUser>(
      this.functions,
      'createUser'
    );
    return defer(() => createUser(command)).pipe(map(r => r.data));
  }

  update(uid: string, command: AdministeredUserCommand): Observable<void> {
    const updateUser = httpsCallable<AdministeredUser, void>(this.functions, 'updateUser');
    return defer(() => updateUser({ ...command, uid })).pipe(map(r => r.data));
  }

  copyEmail(user: AdministeredUser) {
    const resetPasswordPath =
      window.location.origin + '/reset-password?email=' + encodeURIComponent(user.email);
    const homePath = window.location.origin;
    const loginPath = window.location.origin + '/login';
    const email = `Bonjour ${user.displayName}.

Pour pouvoir accéder à l'application "Maison Solidaire",
il te faudra choisir un mot de passe en te rendant à l'adresse suivante\u00a0:
${resetPasswordPath} ou, si ton adresse email est celle d'un compte Google,
t'identifier directement via Google à l'adresse suivante\u00a0:
${loginPath}.

Une fois le mot de passe choisi ou l'identification effectuée, tu pourras accéder
à l'application en te rendant à l'adresse suivante\u00a0:
${homePath}.`;
    from(navigator.clipboard.writeText(email)).subscribe(() =>
      this.toastService.display({
        icon: icons.copied,
        message: 'Message copié dans le presse-papier\u00a0!'
      })
    );
  }

  copyResetPasswordEmail(user: AdministeredUser, resetPasswordLinkInfo: ResetPasswordLinkInfo) {
    const homePath = window.location.origin;
    const email = `Bonjour ${user.displayName}.

Pour pouvoir accéder à l'application "Maison Solidaire",
il te faudra choisir un mot de passe en te rendant à l'adresse suivante\u00a0:
${resetPasswordLinkInfo.resetPasswordLink}.

Une fois le mot de passe choisi, tu pourras accéder
à l'application en te rendant à l'adresse suivante\u00a0:
${homePath}.`;
    from(navigator.clipboard.writeText(email)).subscribe(() =>
      this.toastService.display({
        icon: icons.copied,
        message: 'Message copié dans le presse-papier\u00a0!'
      })
    );
  }

  generateResetPasswordLink(uid: string): Observable<ResetPasswordLinkInfo> {
    const generateResetPasswordLink = httpsCallable<string, ResetPasswordLinkInfo>(
      this.functions,
      'generateResetPasswordLink'
    );
    return defer(() => generateResetPasswordLink(uid)).pipe(map(r => r.data));
  }
}
