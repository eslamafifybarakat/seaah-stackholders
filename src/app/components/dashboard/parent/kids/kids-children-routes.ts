
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { KidsListComponent } from './kids-list/kids-list.component';
import { KidDetailsComponent } from './kid-details/kid-details.component';


export const kidsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: KidsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: KidDetailsComponent,
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
