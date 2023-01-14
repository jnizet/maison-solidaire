import { Routes } from '@angular/router';
import { FutureActivitiesComponent } from './future-activities/future-activities.component';
import { ActivityEditionComponent } from './activity-edition/activity-edition.component';

export const ACTIVITY_ROUTES: Routes = [
  {
    path: '',
    component: FutureActivitiesComponent
  },
  {
    path: 'new',
    component: ActivityEditionComponent
  },
  {
    path: ':activityId/edit',
    component: ActivityEditionComponent
  }
];
