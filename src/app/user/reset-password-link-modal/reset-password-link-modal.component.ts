import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { exhaustMap, map, Observable, startWith, Subject } from 'rxjs';
import { AdministeredUser, ResetPasswordLinkInfo, UserService } from '../user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as icons from '../../icon/icons';
import { IconDirective } from '../../icon/icon.directive';

interface ViewModel {
  resetPasswordLinkInfo?: ResetPasswordLinkInfo;
}

@Component({
  selector: 'ms-reset-password-link-modal',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './reset-password-link-modal.component.html',
  styleUrls: ['./reset-password-link-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordLinkModalComponent {
  readonly vm$: Observable<ViewModel>;
  readonly icons = icons;
  private readonly generateResetPasswordLinkSubject = new Subject<void>();

  user!: AdministeredUser;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) {
    this.vm$ = this.generateResetPasswordLinkSubject.pipe(
      exhaustMap(() =>
        userService
          .generateResetPasswordLink(this.user.uid)
          .pipe(map(resetPasswordLinkInfo => ({ resetPasswordLinkInfo })))
      ),
      startWith({})
    );
  }

  generateResetPasswordLink() {
    this.generateResetPasswordLinkSubject.next();
  }

  copyEmail(resetPasswordLinkInfo: ResetPasswordLinkInfo) {
    this.userService.copyResetPasswordEmail(this.user, resetPasswordLinkInfo);
  }
}
