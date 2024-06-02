
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestDetailsComponent } from './request-details/request-details.component';


export const banksRequestsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: RequestsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Requests.List',
      title: 'Appointments'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: RequestDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'kidDetails'
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
