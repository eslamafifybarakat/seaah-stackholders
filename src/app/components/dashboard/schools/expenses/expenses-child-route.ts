
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';


export const ExpensesChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // Expenses List
  {
    path: 'List',
    component: ExpensesListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Expenses.List',
      title: 'Expenses'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: ExpenseDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.ExpenseDetails',
      title: 'ExpenseDetails'
    },
    pathMatch: 'full'
  },
  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors' } // Redirect all unknown paths to '/Errors'
];
