import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '../../icon/icon.directive';
import { Spinner } from '../spinner';

@Component({
  selector: 'ms-spinning-icon',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './spinning-icon.component.html',
  styleUrls: ['./spinning-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinningIconComponent {
  @Input() icon!: string;
  @Input() spinner!: Spinner;
  @Input() message!: string;
}
