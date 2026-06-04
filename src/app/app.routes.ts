import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'recuperar',
        loadComponent: () =>
          import('./auth/recuperar/recuperar.component').then(m => m.RecuperarComponent)
      },
      {
        path: 'whatsapp',
        loadComponent: () =>
          import('./auth/whatsapp/whatsapp.component').then(m => m.WhatsappComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];