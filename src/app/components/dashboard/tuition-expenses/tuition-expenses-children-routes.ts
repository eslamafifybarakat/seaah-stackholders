
import { PermissionGuard } from '../../../services/authentication/guards/permission.guard';
import { ErrorsComponent } from "../../errors/errors.component";
import { TuitionExpensesListComponent } from './tuition-expenses-list/tuition-expenses-list.component';


export const TuitionExpensesChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: TuitionExpensesListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.TuitionExpenses.List',
      title: 'TuitionExpenses'
    },
    pathMatch: 'full'
  },

  { path: '**', component: ErrorsComponent }
];
