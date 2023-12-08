import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDirective } from '../../icon/icon.directive';
import { Spinner } from '../spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ms-spinning-icon',
  standalone: true,
  imports: [IconDirective, AsyncPipe],
  templateUrl: './spinning-icon.component.html',
  styleUrls: ['./spinning-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinningIconComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) spinner!: Spinner;
  @Input({ required: true }) message!: string;
}
