import { PermissionGuard } from '../../services/authentication/guards/permission.guard';
import { organizationsChildrenRoutes } from "../dashboard/organizations/organizations-children-routes";
import { StatisticsComponent } from "./../dashboard/statistics/statistics.component";
import { ErrorsComponent } from "../errors/errors.component";
import { usersChildrenRoutes } from '../dashboard/users/users-children-routes';
import { installmentWaysChildrenRoutes } from '../dashboard/installment-ways/installment-ways-children-routes';
import { kidsChildrenRoutes } from '../dashboard/kids/kids-children-routes';
import { TuitionExpensesChildrenRoutes } from '../dashboard/tuition-expenses/tuition-expenses-children-routes';

export const dashBoardChildrenV2Routes: any[] = [
  { path: '', redirectTo: 'Statistics', pathMatch: 'full' },
  {
    path: 'Users',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('../dashboard/users/users.component').then(
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
      import('../dashboard/organizations/organizations.component').then(
        (c) => c.OrganizationsComponent
      ),
    children: organizationsChildrenRoutes
  },
  {
    path: 'Statistics',
    component: StatisticsComponent,
    pathMatch: 'full'
  },
  {
    path: 'Installment-Ways',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.installmentWays.List',
      title: 'installmentWays'
    },
    loadComponent: () =>
      import('../dashboard/installment-ways/installment-ways.component').then(
        (c) => c.InstallmentWaysComponent
      ),
    children: installmentWaysChildrenRoutes
  },
  {
    path: 'Kids',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.kids.List',
      title: 'kids'
    },
    loadComponent: () =>
      import('../dashboard/kids/kids.component').then(
        (c) => c.KidsComponent
      ),
    children: kidsChildrenRoutes
  },
  {
    path: 'Tuition-Expenses',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.TuitionExpenses.List',
      title: 'kids'
    },
    loadComponent: () =>
      import('../dashboard/tuition-expenses/tuition-expenses.component').then(
        (c) => c.TuitionExpensesComponent
      ),
    children: TuitionExpensesChildrenRoutes
  },
  // {
  //   path: 'Clients/:id',
  //   component: EditClientComponent,
  //   pathMatch: 'full'
  // },
  { path: '**', component: ErrorsComponent }
];
