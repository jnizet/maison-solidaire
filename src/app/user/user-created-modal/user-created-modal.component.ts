import { Component } from '@angular/core';
import * as icons from '../../icon/icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconDirective } from '../../icon/icon.directive';

@Component({
  selector: 'ms-user-created-modal',
  templateUrl: './user-created-modal.component.html',
  styleUrls: ['./user-created-modal.component.scss'],
  standalone: true,
  imports: [IconDirective]
})
export class UserCreatedModalComponent {
  icons = icons;

  userName?: string;

  constructor(public activeModal: NgbActiveModal) {}
}
