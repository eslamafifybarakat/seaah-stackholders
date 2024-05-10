import { PermissionGuard } from './../../services/authentication/guards/permission.guard';
import { StatisticsComponent } from "./statistics/statistics.component";
import { usersChildrenRoutes } from './users/users-children-routes';
import { ErrorsComponent } from "../errors/errors.component";
import { organizationsChildrenRoutes } from './organizations/organizations-children-routes';

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
  { path: '**', component: ErrorsComponent }
];
