// Services
import { PermissionGuard } from '../../services/authentication/guards/permission.guard';
// Components
import { StatisticsComponent } from "./../dashboard/statistics/statistics.component";
// TS Files
import { SchoolsChildrenRoutes } from '../dashboard/schools/schools-child-route';
import { ParentChildrenRoutes } from '../dashboard/parent/parent-child-route';

import { installmentWaysChildrenRoutes } from '../dashboard/installment-ways/installment-ways-children-routes';
import { errorsChildrenRoutes } from '../errors/errors-children-routes';

export const dashBoardChildrenV2Routes: any[] = [
  { path: '', redirectTo: 'Statistics', pathMatch: 'full' },
  // Statistics
  {
    path: 'Statistics',
    component: StatisticsComponent,
    pathMatch: 'full'
  },
  // Parents
  {
    path: 'Parent',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./../dashboard/parent/parent.component').then(
        (c) => c.ParentComponent
      ),
    children: ParentChildrenRoutes
  },
  {
    path: ':lang/Parent',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./../dashboard/parent/parent.component').then(
        (c) => c.ParentComponent
      ),
    children: ParentChildrenRoutes
  },
  // Schools
  {
    path: 'Schools',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools',
      title: 'Schools'
    },
    loadComponent: () =>
      import('./../dashboard/schools/schools.component').then(
        (c) => c.SchoolsComponent
      ),
    children: SchoolsChildrenRoutes
  },
  {
    path: ':lang/Schools',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools',
      title: 'Schools'
    },
    loadComponent: () =>
      import('./../dashboard/schools/schools.component').then(
        (c) => c.SchoolsComponent
      ),
    children: SchoolsChildrenRoutes
  },
  // {
  //   path: 'Installment-Ways',
  //   // canActivate: [PermissionGuard],
  //   data: {
  //     permission: 'Pages.installmentWays.List',
  //     title: 'installmentWays'
  //   },
  //   loadComponent: () =>
  //     import('../dashboard/installment-ways/installment-ways.component').then(
  //       (c) => c.InstallmentWaysComponent
  //     ),
  //   children: installmentWaysChildrenRoutes
  // },

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors' } // Redirect all unknown paths to '/Errors'
];
