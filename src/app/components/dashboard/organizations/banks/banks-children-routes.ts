import { BankDetailsComponent } from './bank-details/bank-details.component';
import { ErrorsComponent } from './../../../errors/errors.component';
import { BanksListComponent } from "./banks-list/banks-list.component";


export const banksChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: BanksListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Bank.List',
      title: 'Banks'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: BankDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.details.List',
      title: 'details'
    },
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
