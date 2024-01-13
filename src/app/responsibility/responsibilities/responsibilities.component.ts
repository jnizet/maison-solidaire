import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Responsibility, ResponsibilityService } from '../../shared/responsibility.service';
import { CurrentUser, CurrentUserService } from '../../current-user.service';
import * as icons from '../../icon/icons';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { ContactComponent } from '../../shared/responsibility/contact/contact.component';
import { RouterLink } from '@angular/router';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ResponsibilityComponent } from '../../shared/responsibility/responsibility.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ms-responsibilities',
  standalone: true,
  imports: [
    PageTitleDirective,
    ContactComponent,
    RouterLink,
    IconDirective,
    LoadingSpinnerComponent,
    ResponsibilityComponent
  ],
  templateUrl: './responsibilities.component.html',
  styleUrls: ['./responsibilities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilitiesComponent {
  readonly responsibilities: Signal<Array<Responsibility> | undefined>;
  user: Signal<CurrentUser | null>;
  icons = icons;

  constructor(
    responsibilityService: ResponsibilityService,
    currentUserService: CurrentUserService
  ) {
    this.user = currentUserService.currentUser;
    this.responsibilities = toSignal(responsibilityService.list());
  }
}
