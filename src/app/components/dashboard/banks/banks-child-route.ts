
import { errorsChildrenRoutes } from '../../errors/errors-children-routes';
import { banksRequestsChildrenRoutes } from './requests/bank-reqests-route';


export const BankChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Requests', pathMatch: 'full' },
  // Requests
  {
    path: 'Requests',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Bank.Requests',
      title: 'requests'
    },
    loadComponent: () =>
      import('./requests/requests.component').then(
        (c) => c.RequestsComponent
      ),
    children: banksRequestsChildrenRoutes
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
