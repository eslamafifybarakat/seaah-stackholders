import { BanksService } from './../../../../services/banks.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { InstallmentRequestsService } from './../../../../services/installment_requests.service';
import { keys } from './../../../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription, catchError, finalize, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    CommonModule,
    FormsModule
  ],
  selector: 'app-edit-my-expense-request',
  templateUrl: './edit-my-expense-request.component.html',
  styleUrls: ['./edit-my-expense-request.component.scss']
})
export class EditMyExpenseRequestComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  step: number = 1;
  data: any;

  KidData: any;
  currentUserInformation: any | null;

  // Start Banks Variables
  banksList: any = [];
  isLoadingBank: boolean = false;
  // End Banks Variables
  // Start Installment Ways Variables
  installmentWays: any = [];
  isLoadingInstallmentWays: boolean = false;
  // End Installment Ways Variables

  expenseForm = this.fb?.group(
    {
      bank: [null, {
        validators: [
          Validators.required]
      }],
      installmentWay: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }]
    }
  );
  get formControls(): any {
    return this.expenseForm?.controls;
  }

  constructor(
    private installmentRequestsService: InstallmentRequestsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
    this.data = this.config.data.event;
    let bankNameObj: any = JSON.parse(this.data?.banks?.name?.en);
    this.data['bankName'] = bankNameObj[this.currentLanguage];
    this.KidData = this.config?.data.event;

    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.getBanks();
    // if (this.KidData) {
    //   let data: any = {};
    //   data['description'] = this.KidData.installmentways?.description[this.currentLanguage];
    //   data['id'] = 1;
    //   data['name'] = this.KidData.installmentways?.name[this.currentLanguage];
    //   data['period'] = '5';
    //   this.expenseForm.patchValue({
    //     installmentWay: data
    //   });
    // }
  }

  // Start Banks List Functions
  getBanks(): void {
    this.isLoadingBank = true;
    let banksSubscription: Subscription = this.banksService?.getBanksList()
      .pipe(
        tap((res: any) => {
          this.processBanksListResponse(res)
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeBanksList())
      ).subscribe();
    this.subscriptions.push(banksSubscription);
  }
  private processBanksListResponse(response: any): void {
    if (response?.status == 200 || response?.status == 201) {
      this.banksList = response?.data?.items;
      this.banksList?.forEach((item: any) => {
        let name: any = JSON.parse(item?.name || "{}");
        item['bankName'] = name[this.currentLanguage];
        if (this.KidData?.banks && (this.KidData?.banks?.id == item?.id)) {
          this.expenseForm.patchValue({
            bank: item
          });
          this.onBankChange({ value: item });
        }
      });
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeBanksList(): void {
    this.isLoadingBank = false;
  }
  onBankChange(event: any): void {
    this.installmentWays = event?.value?.installment_ways;
    this.installmentWays?.forEach((item: any) => {
      let nameObj: any = item?.name;
      item['name'] = nameObj[this.currentLanguage];
      if (this.data?.installmentways && (this.data?.installmentways?.id == item?.id)) {
        this.expenseForm.patchValue({
          installmentWay: item
        });
      }
    });
  }
  // End Banks List Functions

  totalExpenses(): any {
    let total: any = 0;
    this.KidData?.tuitions?.forEach((element: any) => {
      total = total + +element?.total;
    });
    return total;
  }
  // Start Add Expenses Functions
  submit(): void {
    if (this.expenseForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditExpensesRequests(formData);
    } else {
      this.publicService?.validateAllFormFields(this.expenseForm);
    }
  }
  private extractFormData(): any {
    let kidFormData: any = this.expenseForm?.value;
    let expensesIds: any = [];
    this.KidData?.tuitions?.forEach((element: any) => {
      expensesIds?.push(element?.id);
    });
    let formData = new FormData();
    formData.append('kids_id', this.KidData?.id);
    formData.append('parent_id', this.KidData?.parent_id);
    formData.append('organization_id', this.KidData?.organizations?.id);
    formData.append('tuition_expense_ids', this.KidData?.tuition_expense_ids);
    formData.append('total_amount', this.KidData?.total_amount);
    formData.append('bank_id', kidFormData?.bank?.id);
    formData.append('installment_ways_id', kidFormData?.installmentWay?.id);
    formData.append('_method', 'put');
    formData.append('installment_1_status', this.KidData?.installment_1_status);
    formData.append('installment_2_status', this.KidData?.installment_2_status);
    formData.append('installment_3_status', this.KidData?.installment_3_status);
    // let finalData: any = {
    //   kids_id: this.KidData?.id.toString(),
    //   bank_id: this.KidData?.bank_id,
    //   parent_id: this.KidData?.parent_id,
    //   organization_id: this.KidData?.organizations?.id.toString(),

    //   tuition_expense_ids: this.KidData?.tuition_expense_ids,
    //   total_amount: this.KidData?.total_amount,
    //   installment_ways_id: kidFormData?.installmentWay?.id.toString(),
    //   _method: 'put',

    //   installment_1_status: this.KidData?.installment_1_status,
    //   installment_2_status: this.KidData?.installment_2_status,
    //   installment_3_status: this.KidData?.installment_3_status
    // }
    return formData;
  }
  private addEditExpensesRequests(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditExpense: Subscription = this.installmentRequestsService?.addEditInstallmentRequest(formData, this.KidData?.id ? this.KidData?.id : null).pipe(
      tap(res => this.handleAddEditExpensesRequests(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditExpense);
  }
  private handleAddEditExpensesRequests(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200 || response?.status == 201) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Expenses Functions

  next(): void {
    this.step = 2;
  }
  back(): void {
    this.step = 1;
  }
  cancel(): void {
    this.ref.close();
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
