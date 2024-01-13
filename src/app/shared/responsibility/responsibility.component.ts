import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Responsibility } from '../responsibility.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IconDirective } from '../../icon/icon.directive';
import { ContactComponent } from './contact/contact.component';

import * as icons from '../../icon/icons';

@Component({
  selector: 'ms-responsibility',
  standalone: true,
  imports: [NgbPopover, IconDirective, ContactComponent],
  templateUrl: './responsibility.component.html',
  styleUrls: ['./responsibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilityComponent {
  readonly icons = icons;

  responsibility = input.required<Responsibility>();
}
