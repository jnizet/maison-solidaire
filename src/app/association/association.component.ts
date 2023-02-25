import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import {
  COORDINATION,
  COUNCIL,
  Responsibility,
  ResponsibilityService
} from '../shared/responsibility.service';
import { ResponsibilityComponent } from '../shared/responsibility/responsibility.component';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { AsyncPipe, NgIf } from '@angular/common';

interface ViewModel {
  coordination: Responsibility;
  council: Responsibility;
}

@Component({
  selector: 'ms-association',
  standalone: true,
  imports: [ResponsibilityComponent, PageTitleDirective, NgIf, AsyncPipe],
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationComponent {
  vm$: Observable<ViewModel>;

  constructor(responsibilityService: ResponsibilityService) {
    this.vm$ = combineLatest({
      coordination: responsibilityService.getBySlug(COORDINATION),
      council: responsibilityService.getBySlug(COUNCIL)
    });
  }
}
