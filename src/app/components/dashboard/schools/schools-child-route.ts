
// Services
import { TuitionExpensesChildrenRoutes } from '../tuition-expenses/tuition-expenses-children-routes';
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';

// TS Files
import { kidsRequestsChildrenRoutes } from './kids-requests/kids-requests-children-routes';
import { errorsChildrenRoutes } from '../../errors/errors-children-routes';


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
