
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { MyExpensesChildrenRoutes } from './my-expenses/myExpenses-children-routes';
import { errorsChildrenRoutes } from '../../errors/errors-children-routes';
import { kidsChildrenRoutes } from './kids/kids-children-routes';


export const ParentChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Kids', pathMatch: 'full' },
  // Kids
  {
    path: 'Kids',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.kids.List',
      title: 'kids'
    },
    loadComponent: () =>
      import('./kids/kids.component').then(
        (c) => c.KidsComponent
      ),
    children: kidsChildrenRoutes
  },
  // My Expenses
  {
    path: 'myExpenses',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.myExpenses',
      title: 'myExpenses'
    },
    loadComponent: () =>
      import('./my-expenses/my-expenses.component').then(
        (c) => c.MyExpensesComponent
      ),
    children: MyExpensesChildrenRoutes
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
