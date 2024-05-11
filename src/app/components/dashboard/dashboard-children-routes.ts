import { PermissionGuard } from './../../services/authentication/guards/permission.guard';
import { StatisticsComponent } from "./statistics/statistics.component";
import { usersChildrenRoutes } from './users/users-children-routes';
import { organizationsChildrenRoutes } from './organizations/organizations-children-routes';
import { errorsChildrenRoutes } from '../errors/errors-children-routes';

export const dashBoardChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Statistics', pathMatch: 'full' },
  {
    path: 'Clients',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./users/users.component').then(
        (c) => c.UsersComponent
      ),
    children: usersChildrenRoutes
  },
  {
    path: 'Organizations',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./organizations/organizations.component').then(
        (c) => c.OrganizationsComponent
      ),
    children: organizationsChildrenRoutes
  },
  {
    path: 'Statistics',
    component: StatisticsComponent,
    pathMatch: 'full'
  },
  // {
  //   path: 'Clients/:id',
  //   component: EditClientComponent,
  //   pathMatch: 'full'
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
