import { SchoolDetailsComponent } from './school-details/school-details.component';
import { SchoolsListComponent } from './schools-list/schools-list.component';
import { ErrorsComponent } from '../../../errors/errors.component';


export const schoolsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: SchoolsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools.List',
      title: 'Schools'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: SchoolDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.details.List',
      title: 'details'
    },
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
