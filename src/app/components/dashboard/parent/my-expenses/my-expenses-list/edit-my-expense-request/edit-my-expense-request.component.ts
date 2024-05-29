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

    // this.installmentWays?.forEach((item: any) => {
    //   let nameObj: any = JSON.parse(item?.name || '{}');
    //   item['name'] = nameObj[this.currentLanguage];
    //   if (this.KidData?.installmentways && (this.KidData?.installmentways?.id == item?.id)) {
    //     this.expenseForm.patchValue({
    //       installmentWay: item
    //     });
    //   }
    // });
  }
  // End Banks List Functions

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
    let expensesTotal: any = [];
    this.KidData?.expenses?.forEach((element: any) => {
      expensesIds?.push(element?.id);
      expensesTotal?.push(element?.total);
    });
    if (expensesIds?.length <= 0) {
      expensesIds = [0];
    }
    if (expensesTotal?.length <= 0) {
      expensesTotal = [0];
    }
    let finalData: any = {
      kids_id: [this.KidData?.id],
      parent_id: this.KidData?.parent_id,
      organization_id: [this.KidData?.school_id],

      tuition_expense_ids: expensesIds,
      total_amount: expensesTotal,

      bank_id: [kidFormData?.bank?.id],
      installment_ways_id: [kidFormData?.installmentWay?.id],
    }
    return finalData;
  }
  private addEditExpensesRequests(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditExpense: Subscription = this.installmentRequestsService?.addEditInstallmentRequest(formData, null).pipe(
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
  cancel(): void { }

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
