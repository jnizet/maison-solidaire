import { ChangeDetectionStrategy, Component, effect, Signal } from '@angular/core';
import {
  CLOTHES,
  COORDINATION,
  CULTURE,
  FOOD,
  FRENCH,
  HEALTH,
  LODGING,
  PHONES,
  Responsibility,
  ResponsibilityService,
  TRANSPORT
} from '../shared/responsibility.service';
import { combineLatest } from 'rxjs';
import { ResponsibilityComponent } from '../shared/responsibility/responsibility.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StorageService } from '../shared/storage.service';
import { PageTitleDirective } from '../page-title/page-title.directive';
import { NgTemplateOutlet, ViewportScroller } from '@angular/common';
import * as icons from '../icon/icons';
import { IconDirective } from '../icon/icon.directive';
import { toSignal } from '@angular/core/rxjs-interop';

interface ViewModel {
  coordination: Responsibility;
  lodging: Responsibility;
  phones: Responsibility;
  transport: Responsibility;
  food: Responsibility;
  french: Responsibility;
  clothes: Responsibility;
  health: Responsibility;
  culture: Responsibility;

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
    IconDirective,
    NgTemplateOutlet
  ],
  templateUrl: './lodging.component.html',
  styleUrls: ['./lodging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LodgingComponent {
  vm: Signal<ViewModel | undefined>;
  icons = icons;

  scrolled = false;

  constructor(
    responsibilityService: ResponsibilityService,
    storageService: StorageService,
    private scroller: ViewportScroller,
    route: ActivatedRoute
  ) {
    this.vm = toSignal(
      combineLatest({
        lodging: responsibilityService.getBySlug(LODGING),
        phones: responsibilityService.getBySlug(PHONES),
        transport: responsibilityService.getBySlug(TRANSPORT),
        food: responsibilityService.getBySlug(FOOD),
        french: responsibilityService.getBySlug(FRENCH),
        coordination: responsibilityService.getBySlug(COORDINATION),
        clothes: responsibilityService.getBySlug(CLOTHES),
        health: responsibilityService.getBySlug(HEALTH),
        culture: responsibilityService.getBySlug(CULTURE),
        bookUrl: storageService.downloadUrl('livret-hebergeur.pdf'),
        rulesUrl: storageService.downloadUrl('reglement.pdf'),
        legalRouteUrl: storageService.downloadUrl('parcours-juridique.pdf')
      })
    );

    const fragment = route.snapshot.fragment;
    if (fragment) {
      const scrollEffect = effect(() => {
        if (this.vm()) {
          setTimeout(() => {
            this.scrollTo(fragment);
            scrollEffect.destroy();
          });
        }
      });
    }
  }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }
}
