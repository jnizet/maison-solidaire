import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AdministeredUser, ResetPasswordLinkInfo, UserService } from '../user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as icons from '../../icon/icons';
import { IconDirective } from '../../icon/icon.directive';
import { Spinner } from '../../shared/spinner';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';

@Component({
  selector: 'ms-reset-password-link-modal',
  standalone: true,
  imports: [IconDirective, SpinningIconComponent],
  templateUrl: './reset-password-link-modal.component.html',
  styleUrls: ['./reset-password-link-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordLinkModalComponent {
  readonly resetPasswordLinkInfo = signal<ResetPasswordLinkInfo | null>(null);
  readonly icons = icons;
  readonly generating = new Spinner();
  readonly user = signal<AdministeredUser>(undefined!);

  constructor(
    readonly activeModal: NgbActiveModal,
    private userService: UserService
  ) {}

  generateResetPasswordLink() {
    this.userService
      .generateResetPasswordLink(this.user()!.uid)
      .pipe(this.generating.spinUntilFinalization())
      .subscribe(resetPasswordLinkInfo => this.resetPasswordLinkInfo.set(resetPasswordLinkInfo));
  }

  copyEmail() {
    this.userService.copyResetPasswordEmail(this.user(), this.resetPasswordLinkInfo()!);
  }
}
