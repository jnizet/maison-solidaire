import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import * as icons from '../../icon/icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconDirective } from '../../icon/icon.directive';
import { AdministeredUser, UserService } from '../user.service';

@Component({
  selector: 'ms-user-created-modal',
  templateUrl: './user-created-modal.component.html',
  styleUrls: ['./user-created-modal.component.scss'],
  standalone: true,
  imports: [IconDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreatedModalComponent {
  icons = icons;

  readonly user = signal<AdministeredUser>(undefined!);

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) {}

  copyEmail() {
    return this.userService.copyEmail(this.user());
  }
}
