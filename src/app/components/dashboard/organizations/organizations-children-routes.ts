import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { universitiesChildrenRoutes } from './universities/universities-children-routes';
import { schoolsChildrenRoutes } from './schools/schools-children-routes';
import { banksChildrenRoutes } from './banks/banks-children-routes';
import { ErrorsComponent } from "../../errors/errors.component";


export const organizationsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'Banks',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Bank.List',
      title: 'Banks'
    },
    loadComponent: () =>
      import('./banks/banks.component').then(
        (c) => c.BanksComponent
      ),
    children: banksChildrenRoutes
  },
  {
    path: 'Schools',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.School.List',
      title: 'Schools'
    },
    loadComponent: () =>
      import('./schools/schools.component').then(
        (c) => c.SchoolsComponent
      ),
    children: schoolsChildrenRoutes
  },
  {
    path: 'Universities',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.University.List',
      title: 'Universities'
    },
    loadComponent: () =>
      import('./universities/universities.component').then(
        (c) => c.UniversitiesComponent
      ),
    children: universitiesChildrenRoutes
  },
  {
    path: 'Details/:id',
    component: OrganizationDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.details.List',
      title: 'details'
    },
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
