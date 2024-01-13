import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  COORDINATION,
  COUNCIL,
  Responsibility,
  ResponsibilityService
} from '../shared/responsibility.service';
import { ResponsibilityComponent } from '../shared/responsibility/responsibility.component';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { toSignal } from '@angular/core/rxjs-interop';

interface ViewModel {
  coordination: Responsibility;
  council: Responsibility;
}

@Component({
  selector: 'ms-association',
  standalone: true,
  imports: [ResponsibilityComponent, PageTitleDirective],
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationComponent {
  vm: Signal<ViewModel | undefined>;

  constructor(responsibilityService: ResponsibilityService) {
    this.vm = toSignal(
      combineLatest({
        coordination: responsibilityService.getBySlug(COORDINATION),
        council: responsibilityService.getBySlug(COUNCIL)
      })
    );
  }
}
