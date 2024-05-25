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
import { MultiSelectModule } from 'primeng/multiselect';
import { KidsService } from '../../../services/kids.service';
import { KidsListApiResponse } from 'src/app/interfaces/dashboard/kids';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-pay-multi-tuition-now-modal',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    MultiSelectModule
  ],
  templateUrl: './pay-multi-tuition-now-modal.component.html',
  styleUrls: ['./pay-multi-tuition-now-modal.component.scss']
})
export class PayMultiTuitionNowModalComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  KidData: any;
  currentUserInformation: any | null;

  // Start Banks Variables
  banksList: any = [];
  isLoadingBank: boolean = false;
  // End Banks Variables
  // Start Kids List Variables
  isLoadingKidsList: boolean = false;
  kidsList: any[] = []

  // Start Installment Ways Variables
  installmentWays: any = [];
  isLoadingInstallmentWays: boolean = false;
  // End Installment Ways Variables

  expensesForm = this.fb?.group(
    {
      kids: [null, {
        validators: [
          Validators.required]
      }],
      bank: [null, {
        validators: [
          Validators.required]
      }],
      me: [false, {
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
    return this.expensesForm?.controls;
  }

  constructor(
    private installmentRequestsService: InstallmentRequestsService,
    private schoolsService: SchoolsService,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private kidsService: KidsService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.KidData = this.config?.data?.event;
    console.log("comming data ", this.KidData);
    this.getAllKids();
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
    this.getBanks();
  }

  // Start Kids List Functions
  getAllKids(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showGlobalLoader.next(true) : this.isLoadingKidsList = true;
    let kidsSubscription: Subscription = this.kidsService?.getKidsList(null, null, null, null, null, 3)
      .pipe(
        tap((res: KidsListApiResponse) => {
          this.processKidsListResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeKidListLoading())
      ).subscribe();
    this.subscriptions.push(kidsSubscription);
  }
  private processKidsListResponse(response: KidsListApiResponse): void {
    if (response.status == 200) {
      this.kidsList = response?.data?.items;
      this.kidsList?.forEach((item: any) => {
        item['addressName'] = `${item?.address?.region ?? ''}, ${item?.address?.city ?? ''}, ${item?.address?.street ?? ''}, ${item?.address?.zip ?? ''}`;
        let name: any = JSON.parse(item?.school?.name[this.currentLanguage] || '{}');
        item['schoolName'] = name[this.currentLanguage];
        item['status'] = item?.approve_status?.label;
        if (item['status'] == 'Approved') {
          item['active'] = false;
        }
      });
      console.log(this.kidsList);
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeKidListLoading(): void {
    this.isLoadingKidsList = false;
    this.publicService.showGlobalLoader.next(false);
  }
  // End Kids List Functions

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
          this.expensesForm.patchValue({
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
      let nameObj: any = JSON.parse(item?.name || '{}');
      item['name'] = nameObj[this.currentLanguage];
      if (this.KidData?.installmentways && (this.KidData?.installmentways?.id == item?.id)) {
        this.expensesForm.patchValue({
          installmentWay: item
        });
      }
    });
  }
  // End Banks List Functions


  // Start Add Edit Expenses
  submit(): void {
    if (this.expensesForm?.valid) {
      const formData: any = this.extractFormData();
      console.log("formData is: ", formData);
      this.addEditExpense(formData);
    } else {
      this.publicService?.validateAllFormFields(this.expensesForm);
    }
  }
  private extractFormData(): any {
    let expenseFormData: any = this.expensesForm?.value;
    console.log('expenseFormData', expenseFormData);
    console.log('KidData', this.KidData);
    console.log('currentUserInformation', this.currentUserInformation);

    // Prepear Kids Array
    let kidsIds: any = [];
    let tuitionExpenseIds: any = [];
    let organizationsIds: any = [];
    expenseFormData?.kids?.forEach((kid: any) => {
      kidsIds?.push(kid?.id);
      organizationsIds?.push(kid?.school?.id);
      kid?.expenses?.forEach((expense: any) => {
        tuitionExpenseIds?.push(expense?.id);
      });
    });
    if (this.expensesForm?.value?.me) {
      kidsIds?.push(this.currentUserInformation?.id);
      organizationsIds?.push(this.currentUserInformation?.school?.id);
      this.currentUserInformation?.expenses?.forEach((expense: any) => {
        tuitionExpenseIds?.push(expense?.id);
      });
    }
    // Prepear Banks Array
    let BanksIds: any = [];
    BanksIds?.push(expenseFormData?.bank?.id);
    // Prepear Installment Ways Array
    let installmentWaysIds: any = [];
    installmentWaysIds?.push(expenseFormData?.installmentWay?.id);

    let finalData: any = {
      kids_id: kidsIds,
      parent_id: this.KidData?.parent_id,
      bank_id: BanksIds,
      installment_ways_id: installmentWaysIds,
      tuition_expense_ids: tuitionExpenseIds,
      organization_id: organizationsIds,
      total_amount: [100]
    }
    return finalData;
  }
  private addEditExpense(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditExpense: Subscription = this.installmentRequestsService?.addEditInstallmentRequest(formData, null).pipe(
      tap(res => this.handleAddInstallmentRequests(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditExpense);
  }
  private handleAddInstallmentRequests(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Edit Expenses

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
