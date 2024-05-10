import { UniversityDetailsComponent } from './university-details/university-details.component';
import { UniversitiesListComponent } from './universities-list/universities-list.component';
import { ErrorsComponent } from '../../../errors/errors.component';


export const universitiesChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: UniversitiesListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools.List',
      title: 'Schools'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: UniversityDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.details.List',
      title: 'details'
    },
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
