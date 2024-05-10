
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { ErrorsComponent } from "../../errors/errors.component";
import { InstallmentWaysListComponent } from './installment-ways-list/installment-ways-list.component';


export const installmentWaysChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: InstallmentWaysListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    pathMatch: 'full'
  },

  { path: '**', component: ErrorsComponent }
];
