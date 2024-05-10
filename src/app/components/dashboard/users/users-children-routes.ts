
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { ErrorsComponent } from "../../errors/errors.component";
import { UsersListComponent } from './users-list/users-list.component';


export const usersChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: UsersListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    pathMatch: 'full'
  },

  { path: '**', component: ErrorsComponent }
];
