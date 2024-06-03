import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from 'src/app/services/generic/public.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { SchoolsService } from '../../../services/schools.service';
import { DropdownModule } from 'primeng/dropdown';
import { BanksService } from '../../../services/banks.service';
import { InstallmentRequestsService } from '../../../services/installment_requests.service';

@Component({
  selector: 'app-change-request-status-for-expense',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-request-status-for-expense.component.html',
  styleUrls: ['./change-request-status-for-expense.component.scss']
})
export class ChangeRequestStatusForExpenseComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  expensesData: any;
  currentUserInformation: any | null;

  // Start Status Variables
  statusList: any = [];
  isLoadingStatus: boolean = false;
  selectedStatus: any = null;
  // End Status Variables

  changeStatusForm = this.fb?.group(
    {
      status: [null, {
        validators: [
          Validators.required]
      }]
    }
  );
  get formControls(): any {
    return this.changeStatusForm?.controls;
  }

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private installmentRequestsService: InstallmentRequestsService
  ) { }

  ngOnInit(): void {
    this.expensesData = this.config?.data;
    this.statusList = this.expensesData?.status;
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.getStatus();
  }

  // Start Status List Functions
  getStatus(): void {
    // this.isLoadingStatus = true;
    // let statusSubscription: Subscription = this.banksService?.getStatusList()
    //   .pipe(
    //     tap((res: any) => {
    //       this.processStatusListResponse(res)
    //     }),
    //     catchError(err => this.handleError(err)),
    //     finalize(() => this.finalizeStatusList())
    //   ).subscribe();
    // this.subscriptions.push(statusSubscription);
  }
  private processStatusListResponse(response: any): void {
    if (response?.status == 200 || response?.status == 201) {
      this.statusList = response?.data?.items;
      this.statusList?.forEach((item: any) => {
        let name: any = JSON.parse(item?.name || "{}");
        item['bankName'] = name[this.currentLanguage];
        if (this.expensesData?.banks && (this.expensesData?.banks?.id == item?.id)) {
          this.changeStatusForm.patchValue({
            status: item
          });
          this.onStatusChange({ value: item });
        }
      });
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeStatusList(): void {
    this.isLoadingStatus = false;
  }
  onStatusChange(event: any): void {
    this.selectedStatus = event?.value;
  }
  // End Status List Functions

  // Start Change Status Functions
  submit(): void {
    if (this.changeStatusForm?.valid) {
      const formData: any = this.extractFormData();
      this.changeExpensesRequests(formData);
    } else {
      this.publicService?.validateAllFormFields(this.changeStatusForm);
    }
  }
  private extractFormData(): any {
    let formData: any = new FormData();
    formData.append('approve_status', this.selectedStatus?.value,);
    formData.append('_method', 'PUT');
    return formData;
  }
  private changeExpensesRequests(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditExpense: Subscription = this.installmentRequestsService?.changeRequestStatus(formData, this.expensesData?.item?.id).pipe(
      tap(res => this.handlechangeExpensesRequests(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditExpense);
  }
  private handlechangeExpensesRequests(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200 || response?.status == 201) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Change Status Functions

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'succss');
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type?: string | null): void {
    this.alertsService.openToast(type, type, message);
    this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
