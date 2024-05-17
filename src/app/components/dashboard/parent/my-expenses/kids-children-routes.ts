
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { MyExpensesListComponent } from './my-expenses-list/my-expenses-list.component';


export const MyExpensesChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: MyExpensesListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.MyExpenses',
      title: 'MyExpenses'
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
