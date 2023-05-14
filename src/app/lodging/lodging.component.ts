import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CLOTHES,
  COORDINATION,
  FOOD,
  FRENCH,
  HEALTH,
  LODGING,
  PHONES,
  Responsibility,
  ResponsibilityService,
  TRANSPORT
} from '../shared/responsibility.service';
import { combineLatest, Observable, tap } from 'rxjs';
import { ResponsibilityComponent } from '../shared/responsibility/responsibility.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StorageService } from '../shared/storage.service';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { AsyncPipe, NgIf, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import * as icons from '../icon/icons';
import { IconDirective } from '../icon/icon.directive';

interface ViewModel {
  coordination: Responsibility;
  lodging: Responsibility;
  phones: Responsibility;
  transport: Responsibility;
  food: Responsibility;
  french: Responsibility;
  clothes: Responsibility;
  health: Responsibility;

  bookUrl: string;
  rulesUrl: string;
  legalRouteUrl: string;
}

@Component({
  selector: 'ms-lodging',
  standalone: true,
  imports: [
    ResponsibilityComponent,
    RouterLink,
    PageTitleDirective,
    NgIf,
    AsyncPipe,
    IconDirective,
    NgTemplateOutlet
  ],
  templateUrl: './lodging.component.html',
  styleUrls: ['./lodging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LodgingComponent {
  vm$: Observable<ViewModel>;
  icons = icons;

  scrolled = false;

  constructor(
    responsibilityService: ResponsibilityService,
    storageService: StorageService,
    private scroller: ViewportScroller,
    route: ActivatedRoute
  ) {
    this.vm$ = combineLatest({
      lodging: responsibilityService.getBySlug(LODGING),
      phones: responsibilityService.getBySlug(PHONES),
      transport: responsibilityService.getBySlug(TRANSPORT),
      food: responsibilityService.getBySlug(FOOD),
      french: responsibilityService.getBySlug(FRENCH),
      coordination: responsibilityService.getBySlug(COORDINATION),
      clothes: responsibilityService.getBySlug(CLOTHES),
      health: responsibilityService.getBySlug(HEALTH),
      bookUrl: storageService.downloadUrl('livret-hebergeur.pdf'),
      rulesUrl: storageService.downloadUrl('reglement.pdf'),
      legalRouteUrl: storageService.downloadUrl('parcours-juridique.pdf')
    }).pipe(
      tap(() => {
        if (!this.scrolled) {
          this.scrolled = true;
          const fragment = route.snapshot.fragment;
          if (fragment) {
            setTimeout(() => this.scrollTo(fragment));
          }
        }
      })
    );
  }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }
}
