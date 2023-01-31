import { Routes } from '@angular/router';
import { FutureActivitiesComponent } from './future-activities/future-activities.component';

export const ACTIVITY_ROUTES: Routes = [
  {
    path: '',
    component: FutureActivitiesComponent
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./activity-edition/activity-edition.component').then(m => m.ActivityEditionComponent)
  },
  {
    path: ':activityId/edit',
    loadComponent: () =>
      import('./activity-edition/activity-edition.component').then(m => m.ActivityEditionComponent)
  }
];
