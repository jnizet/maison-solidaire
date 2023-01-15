import { Routes } from '@angular/router';
import { ResponsibilitiesComponent } from './responsibilities/responsibilities.component';
import { ResponsibilityEditionComponent } from './responsibility-edition/responsibility-edition.component';

export const RESPONSIBILITY_ROUTES: Routes = [
  {
    path: '',
    component: ResponsibilitiesComponent
  },
  {
    path: ':responsibilitySlug/edit',
    component: ResponsibilityEditionComponent
  }
];
