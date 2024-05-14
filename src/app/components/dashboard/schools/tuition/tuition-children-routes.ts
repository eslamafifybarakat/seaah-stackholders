
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { TuitionsListComponent } from './tuitions-list/tuitions-list.component';


export const TuitionChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: TuitionsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
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
