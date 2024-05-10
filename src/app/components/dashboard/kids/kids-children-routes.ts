
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { ErrorsComponent } from "../../errors/errors.component";
import { KidsListComponent } from './kids-list/kids-list.component';


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

  { path: '**', component: ErrorsComponent }
];
