import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from 'src/app/services/generic/public.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { KidsService } from '../../../services/kids.service';

@Component({
  selector: 'app-edit-request',
  standalone: true,
  imports: [
     // Modules
     ReactiveFormsModule,
     TranslateModule,
     DropdownModule,
     CommonModule,
     FormsModule,
  ],
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss']
})
export class EditRequestComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  currentUserInformation: any | null;

  // Start status List Variables
  statusList: any[] = []

  // Start Installment Ways Variables
  installmentWays: any = [];
  isLoadingInstallmentWays: boolean = false;
  // End Installment Ways Variables

  expensesForm = this.fb?.group(
    {
      status: [null, {
        validators: [
          Validators.required]
      }]
    }
  );
  get formControls(): any {
    return this.expensesForm?.controls;
  }

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    private kidsService: KidsService,
    private authService:AuthService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    this.getStatusList()
   }

  getStatusList(): void {
    if (this.currentLanguage == 'ar') {
      this.statusList = [
        // { id: 0, name: "الكل" },
        { id: 1, name: "قيد الانتظار" },
        { id: 2, name: "مرفوض" },
        { id: 3, name: "موافق عليه" }
      ];
    } else {
      this.statusList = [
        // { id: 0, name: "All" },
        { id: 1, name: "Pending" },
        { id: 2, name: "Rejected" },
        { id: 3, name: "Approved" }
      ];
    }
   
  }


   
  onStatusChange(e:any){

  }

  submit(){

  }

  cancel(){

  }
}
