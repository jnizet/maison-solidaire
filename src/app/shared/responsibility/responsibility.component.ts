import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Responsibility } from '../responsibility.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IconDirective } from '../../icon/icon.directive';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'ms-responsibility',
  standalone: true,
  imports: [CommonModule, NgbPopover, IconDirective, ContactComponent],
  templateUrl: './responsibility.component.html',
  styleUrls: ['./responsibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilityComponent {
  @Input() responsibility!: Responsibility;
}
