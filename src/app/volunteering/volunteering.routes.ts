import { Routes } from '@angular/router';
import { VolunteeringComponent } from './volunteering/volunteering.component';

export const VOLUNTEERING_ROUTES: Routes = [
  {
    path: '',
    component: VolunteeringComponent
  },
  {
    path: 'edit-weekly-schedule',
    loadComponent: () =>
      import('./edit-weekly-schedule/edit-weekly-schedule.component').then(
        m => m.EditWeeklyScheduleComponent
      )
  }
];
