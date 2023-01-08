import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CLOTHES,
  COORDINATION,
  FOOD,
  FRENCH,
  LODGING,
  PHONES,
  Responsibility,
  ResponsibilityService,
  TRANSPORT
} from '../shared/responsibility.service';
import { combineLatest, map, Observable } from 'rxjs';
import { ResponsibilityComponent } from '../shared/responsibility/responsibility.component';
import { RouterLink } from '@angular/router';

interface ViewModel {
  coordination: Responsibility;
  lodging: Responsibility;
  phones: Responsibility;
  transport: Responsibility;
  food: Responsibility;
  french: Responsibility;
  clothes: Responsibility;
}

@Component({
  selector: 'ms-lodging',
  standalone: true,
  imports: [CommonModule, ResponsibilityComponent, RouterLink],
  templateUrl: './lodging.component.html',
  styleUrls: ['./lodging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LodgingComponent {
  vm$: Observable<ViewModel>;

  constructor(responsibilityService: ResponsibilityService) {
    this.vm$ = combineLatest([
      responsibilityService.getBySlug(LODGING),
      responsibilityService.getBySlug(PHONES),
      responsibilityService.getBySlug(TRANSPORT),
      responsibilityService.getBySlug(FOOD),
      responsibilityService.getBySlug(FRENCH),
      responsibilityService.getBySlug(COORDINATION),
      responsibilityService.getBySlug(CLOTHES)
    ]).pipe(
      map(([lodging, phones, transport, food, french, coordination, clothes]) => ({
        lodging,
        phones,
        transport,
        food,
        french,
        coordination,
        clothes
      }))
    );
  }
}
