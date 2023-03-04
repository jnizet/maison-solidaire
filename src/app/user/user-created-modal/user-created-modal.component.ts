import { ChangeDetectionStrategy, Component } from '@angular/core';
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

  user!: AdministeredUser;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) {}

  copyEmail(user: AdministeredUser) {
    return this.userService.copyEmail(user);
  }
}
