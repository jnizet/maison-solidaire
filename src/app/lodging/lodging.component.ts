import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { combineLatest, map, Observable, tap } from 'rxjs';
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

  bookUrl: string;
  rulesUrl: string;
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
    this.vm$ = combineLatest([
      responsibilityService.getBySlug(LODGING),
      responsibilityService.getBySlug(PHONES),
      responsibilityService.getBySlug(TRANSPORT),
      responsibilityService.getBySlug(FOOD),
      responsibilityService.getBySlug(FRENCH),
      responsibilityService.getBySlug(COORDINATION),
      responsibilityService.getBySlug(CLOTHES),
      storageService.downloadUrl('livret-hebergeur.pdf'),
      storageService.downloadUrl('reglement.pdf')
    ]).pipe(
      map(
        ([lodging, phones, transport, food, french, coordination, clothes, bookUrl, rulesUrl]) => ({
          lodging,
          phones,
          transport,
          food,
          french,
          coordination,
          clothes,
          bookUrl,
          rulesUrl
        })
      ),
      tap(() => {
        if (!this.scrolled) {
          this.scrolled = true;
          const fragment = route.snapshot.fragment;
          if (fragment) {
            setTimeout(() => this.scrollTo(fragment), 1);
          }
        }
      })
    );
  }

  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }
}
