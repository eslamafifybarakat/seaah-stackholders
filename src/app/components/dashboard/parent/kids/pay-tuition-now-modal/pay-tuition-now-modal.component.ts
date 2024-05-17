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

@Component({
  selector: 'app-pay-tuition-now-modal',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './pay-tuition-now-modal.component.html',
  styleUrls: ['./pay-tuition-now-modal.component.scss']
})
export class PayTuitionNowModalComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

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

  kidForm = this.fb?.group(
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
    return this.kidForm?.controls;
  }


  constructor(
    private schoolsService: SchoolsService,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.KidData = this.config?.data?.event;
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.getBanks();
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
        finalize(() => this.finalizeSchoolsListLoading())
      ).subscribe();
    this.subscriptions.push(banksSubscription);
  }
  private processBanksListResponse(response: any): void {
    if (response) {
      this.banksList = response?.data?.items?.data;
      this.banksList?.forEach((item: any) => {
        let name: any = JSON.parse(item?.name[this.currentLanguage] || "{}");
        item['bankName'] = name[this.currentLanguage];
      });
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeSchoolsListLoading(): void {
    this.isLoadingBank = false;
  }
  onBankChange(event: any): void {
    console.log(event?.value);
    // this.installmentWays = event?.value?.installment_ways;
    this.installmentWays = [
      {id:1,name:'Eslam'}
    ];
  }
  // End Banks List Functions


  submit(): void {
    if (this.kidForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditKid(formData);
    } else {
      this.publicService?.validateAllFormFields(this.kidForm);
    }
  }
  private extractFormData(): any {
    let kidFormData: any = this.kidForm?.value;
    let formData = new FormData();
    // formData.append('name', kidFormData?.name ?? '');
    // formData.append('code', kidFormData?.code ?? '');
  }
  private addEditKid(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    // let subscribeAddKid: Subscription = this.kidsService?.addEditKid(formData, this.kidId ? this.kidId : null).pipe(
    //   tap(res => this.handleAddKidSuccess(res)),
    //   catchError(err => this.handleError(err))
    // ).subscribe();
    // this.subscriptions.push(subscribeAddKid);
  }
  private handleAddKidSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Edit Kid

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
