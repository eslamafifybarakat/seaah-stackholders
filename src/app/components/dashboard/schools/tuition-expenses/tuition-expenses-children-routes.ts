import { TuitionExpensesListComponent } from "./tuition-expenses-list/tuition-expenses-list.component";
import { errorsChildrenRoutes } from "src/app/components/errors/errors-children-routes";



export const TuitionExpensesChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: TuitionExpensesListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.TuitionExpenses.List',
      title: 'TuitionExpenses'
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
