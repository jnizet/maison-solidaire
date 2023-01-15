import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'email-action',
    loadComponent: () =>
      import('./email-action/email-action.component').then(m => m.EmailActionComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo('/login') },
    children: [
      {
        path: 'users',
        loadChildren: () => import('./user/user.routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'lodging',
        loadComponent: () => import('./lodging/lodging.component').then(m => m.LodgingComponent)
      },
      {
        path: 'association',
        loadComponent: () =>
          import('./association/association.component').then(m => m.AssociationComponent)
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./contact/my-contact-edition/my-contact-edition.component').then(
            m => m.MyContactEditionComponent
          )
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contact/contact.routes').then(m => m.CONTACT_ROUTES)
      },
      {
        path: 'activities',
        loadChildren: () => import('./activity/activity.routes').then(m => m.ACTIVITY_ROUTES)
      }
    ]
  }
];
