
// Services
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';

// TS Files
import { kidsRequestsChildrenRoutes } from './kids-requests/kids-requests-children-routes';
import { errorsChildrenRoutes } from '../../errors/errors-children-routes';
import { TuitionChildrenRoutes } from './tuition/tuition-children-routes';
import { TuitionExpensesChildrenRoutes } from './tuition-expenses/tuition-expenses-children-routes';
import { ExpensesChildrenRoutes } from './expenses/expenses-child-route';


export const SchoolsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Tuition-Expenses', pathMatch: 'full' },
   // Kids Requests
   {
    path: 'KidsRequests',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.KidsRequests',
      title: 'KidsRequests'
    },
    loadComponent: () =>
      import('./../../dashboard/schools/kids-requests/kids-requests.component').then(
        (c) => c.KidsRequestsComponent
      ),
    children: kidsRequestsChildrenRoutes
  },
    // Tuition
    {
      path: 'Tuition',
      // canActivate: [PermissionGuard],
      data: {
        permission: 'Pages.Tuition.List',
        title: 'kids'
      },
      loadComponent: () =>
        import('./../../dashboard/schools/tuition/tuition.component').then(
          (c) => c.TuitionComponent
        ),
      children: TuitionChildrenRoutes
    },
  // Tuition Expenses
  {
    path: 'TuitionExpenses',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.TuitionExpenses.List',
      title: 'kids'
    },
    loadComponent: () =>
      import('./../../dashboard/schools/tuition-expenses/tuition-expenses.component').then(
        (c) => c.TuitionExpensesComponent
      ),
    children: TuitionExpensesChildrenRoutes
  },
  // Expenses
  {
    path: 'Expenses',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Expenses.List',
      title: 'Expenses'
    },
    loadComponent: () =>
      import('./../../dashboard/schools/expenses/expenses.component').then(
        (c) => c.ExpensesComponent
      ),
    children: ExpensesChildrenRoutes
  },

   // Errors
   {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors' } // Redirect all unknown paths to '/Errors'
];
