import { Routes } from '@angular/router';

// Components

// TS Files for child routes
import { dashBoardChildrenRoutes } from './components/dashboard/dashboard-children-routes';
import { authChildrenRoutes } from './components/auth/auth-children-routes';
import { errorsChildrenRoutes } from './components/errors/errors-routes';

//Services
import { AuthGuard } from './services/authentication/guards/auth.guard';
import { dashBoardChildrenV2Routes } from './components/dashboard-v2/dashboard-children-routes-v2';


export const appRoutes: Routes = [
  { path: '', redirectTo: 'Auth', pathMatch: 'full' },
  {
    path: 'Auth',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    children: authChildrenRoutes
  },
  {
    path: ':lang/Auth',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    children: authChildrenRoutes
  },
  {
    path: 'Dashboard2',
    // canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashBoardChildrenRoutes
  },
  {
    path: ':lang/Dashboard2',
    // canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashBoardChildrenRoutes
  },
  {
    path: 'Dashboard',
    // canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard-v2/dashboard-v2.component').then(
        (c) => c.DashboardV2Component
      ),
    children: dashBoardChildrenV2Routes
  },
  {
    path: ':lang/Dashboard',
    // canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard-v2/dashboard-v2.component').then(
        (c) => c.DashboardV2Component
      ),
    children: dashBoardChildrenV2Routes
  },
  {
    path: '**', loadComponent: () =>
      import('./components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  }
];
