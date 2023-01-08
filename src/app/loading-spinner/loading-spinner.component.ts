import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ms-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: []
})
export class LoadingSpinnerComponent {}
