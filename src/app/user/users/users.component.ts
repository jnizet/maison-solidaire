import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdministeredUser, UserService } from '../user.service';
import { from, Observable } from 'rxjs';
import * as icons from '../../icon/icons';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { IconDirective } from '../../icon/icon.directive';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'ms-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterLink,
    PageTitleDirective,
    LoadingSpinnerComponent,
    IconDirective
  ]
})
export class UsersComponent {
  users$: Observable<Array<AdministeredUser>>;
  icons = icons;

  constructor(userService: UserService, private toastService: ToastService) {
    this.users$ = userService.listUsers();
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
        icon: this.icons.copied,
        message: 'Email copié dans le presse-papier\u00a0!'
      })
    );
  }

  trackByUid(index: number, user: AdministeredUser) {
    return user.uid;
  }
}
