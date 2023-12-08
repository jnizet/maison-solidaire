import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Responsibility, ResponsibilityService } from '../../shared/responsibility.service';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import { combineLatest, Observable } from 'rxjs';
import * as icons from '../../icon/icons';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { RouterLink } from '@angular/router';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ResponsibilityComponent } from '../../shared/responsibility/responsibility.component';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  responsibilities: Array<Responsibility>;
  user: CurrentUser | null;
}

@Component({
  selector: 'ms-responsibilities',
  standalone: true,
  imports: [
    PageTitleDirective,
    ContactComponent,
    RouterLink,
    IconDirective,
    LoadingSpinnerComponent,
    ResponsibilityComponent,
    AsyncPipe
  ],
  templateUrl: './responsibilities.component.html',
  styleUrls: ['./responsibilities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilitiesComponent {
  vm$: Observable<ViewModel>;

  icons = icons;

  constructor(
    responsibilityService: ResponsibilityService,
    currentUserService: CurrentUserService
  ) {
    this.vm$ = combineLatest({
      responsibilities: responsibilityService.list(),
      user: currentUserService.getCurrentUser()
    });
  }
}
