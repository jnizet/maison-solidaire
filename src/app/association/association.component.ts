import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable } from 'rxjs';
import {
  COORDINATION,
  COUNCIL,
  Responsibility,
  ResponsibilityService
} from '../shared/responsibility.service';
import { ResponsibilityComponent } from '../shared/responsibility/responsibility.component';
import { PageTitleDirective } from '../page-title/page-title.directive';

interface ViewModel {
  coordination: Responsibility;
  council: Responsibility;
}

@Component({
  selector: 'ms-association',
  standalone: true,
  imports: [CommonModule, ResponsibilityComponent, PageTitleDirective],
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationComponent {
  vm$: Observable<ViewModel>;

  constructor(responsibilityService: ResponsibilityService) {
    this.vm$ = combineLatest([
      responsibilityService.getBySlug(COORDINATION),
      responsibilityService.getBySlug(COUNCIL)
    ]).pipe(
      map(([coordination, council]) => ({
        coordination,
        council
      }))
    );
  }
}
