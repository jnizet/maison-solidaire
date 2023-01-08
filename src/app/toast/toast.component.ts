import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Toast, ToastService } from './toast.service';
import { IconDirective } from '../icon/icon.directive';

@Component({
  selector: 'ms-toast',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  toast$: Observable<Toast | null>;

  constructor(toastService: ToastService) {
    this.toast$ = toastService.toast$;
  }
}
