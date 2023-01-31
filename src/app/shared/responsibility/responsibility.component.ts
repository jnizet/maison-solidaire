import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Responsibility } from '../responsibility.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IconDirective } from '../../icon/icon.directive';
import { ContactComponent } from './contact/contact.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'ms-responsibility',
  standalone: true,
  imports: [NgbPopover, IconDirective, ContactComponent, NgFor],
  templateUrl: './responsibility.component.html',
  styleUrls: ['./responsibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilityComponent {
  @Input() responsibility!: Responsibility;
}
