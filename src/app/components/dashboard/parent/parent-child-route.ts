
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { errorsChildrenRoutes } from '../../errors/errors-children-routes';
import { ErrorsComponent } from "../../errors/errors.component";
import { kidsChildrenRoutes } from './kids/kids-children-routes';


export const ParentChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Kids', pathMatch: 'full' },
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
