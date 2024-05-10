// Modules
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { FileUploadComponent } from '../../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { InstallmentWaysListingItem, InstallmentWaysListApiResponse } from '../../../../../interfaces/dashboard/installmentWays';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { InstallmentWaysService } from '../../../services/installment-ways.service';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BanksService } from '../../../services/banks.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    MultiSelectModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
    FormsModule,

    // Components
    FileUploadComponent
  ],
  selector: 'app-add-edit-bank',
  templateUrl: './add-edit-bank.component.html',
  styleUrls: ['./add-edit-bank.component.scss'],
  animations: [
    trigger('messageState', [
      // Define the default states (e.g., 'void' means no state)
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      // Define the transition between states
      transition('* <=> *', animate('300ms ease-in'))
    ])
  ]
})
export class AddEditBankComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  //  Installment Ways Variables
  installmentWays: InstallmentWaysListingItem[] = [];
  isLoadingInstallmentWays: boolean = false;

  minEndTime: any;

  isEdit: boolean = false;
  bankId: number;
  bankData: any;

  bankFile: any = null;
  bankFileSrc: any;

  bankForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      location: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      startTime: [null, {
        validators: [
          Validators.required]
      }],
      endTime: [null, {
        validators: [
          Validators.required]
      }],
      installmentWays: [null, {
        validators: [
          Validators.required]
      }],
      bankFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.bankForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.bankData = this.config.data;
    if (this.bankData.type == 'edit') {
      this.isEdit = true;
      this.bankId = this.bankData?.item?.id;
      this.patchValue();
    } else {
      this.getInstallmentWays();
    }
    this.updateMetaTagsForSEO();
    if (this.isEdit) {
      // Remove the required validator from the bankFile control
      const bankFileControl = this.bankForm.get('bankFile');
      if (bankFileControl) {
        bankFileControl.clearValidators(); // Remove all validators
        bankFileControl.updateValueAndValidity(); // Update control to reflect changes
      }
    }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'البنوك',
      description: 'البنوك',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.bankForm.patchValue({
      name: this.bankData?.item?.name,
      location: this.bankData?.item?.location,
      startTime: this.convertTime(this.bankData?.item?.start_time),
      endTime: this.convertTime(this.bankData?.item?.end_time),
    });
    this.bankFileSrc = this.bankData?.item?.image_path;
    this.getInstallmentWays();
  }
  convertTime(date: any): any {
    const timeString = date;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateTimeString = `${dateString}T${timeString}`;
    const time: any = new Date(dateTimeString);
    return time;
  }
  // Start Installment Ways List Functions
  getInstallmentWays(): void {
    this.isLoadingInstallmentWays = true;
    let insallmentWaysSubscription: Subscription = this.installmentWaysService?.getInstallmentWaysList()
      .pipe(
        tap((res: InstallmentWaysListApiResponse) => this.processInstallmentWaysListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeInstallmentWayList())
      ).subscribe();
    this.subscriptions.push(insallmentWaysSubscription);
  }
  private processInstallmentWaysListResponse(response: InstallmentWaysListApiResponse): void {
    if (response.status == 200) {
      this.installmentWays = response?.data?.items;
      if (this.isEdit) {
        // Assuming this.bankData.item.installment_ways is a JSON string
        let waysItems: any = this.bankData?.item?.installment_ways;
        let patchWays: any = [];
        waysItems?.forEach((element: any) => {
          this.installmentWays.forEach((item: InstallmentWaysListingItem) => {
            if (element.id == item.id) {
              patchWays.push(item);
            }
          });
        });
        this.bankForm.patchValue({
          installmentWays: patchWays
        });
      }
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeInstallmentWayList(): void {
    this.isLoadingInstallmentWays = false;
  }
  // End Installment Ways List Functions

  // Upload File
  uploadFile(event: any): void {
    this.bankFile = event.file;
    this.bankForm.get('bankFile').setValue(this.bankFile);
  }
  // Start Time Functions
  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.bankForm?.get('endTime')?.reset();
  }
  clearStartTime(): void {
    this.bankForm?.get('endTime')?.reset();
  }
  // End Time Functions

  // Start Add/Edit Bank
  submit(): void {
    if (this.bankForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditBank(formData);
    } else {
      this.publicService?.validateAllFormFields(this.bankForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    let installmentWays: any = this.bankForm.value.installmentWays;
    let installmentWaysIds: any = [];
    installmentWays.forEach(element => {
      installmentWaysIds.push(element.id);
    });
    let startTime: any = this.bankForm?.value?.startTime;
    let endTime: any = this.bankForm?.value?.endTime;
    formData.append('name[en]', this.bankForm?.value?.name);
    formData.append('name[ar]', this.bankForm?.value?.name);
    formData.append('location[en]', this.bankForm?.value?.location);
    formData.append('location[ar]', this.bankForm?.value?.location);
    formData.append('start_time', startTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('end_time', endTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('installment_ways', JSON.stringify(installmentWaysIds));
    if (this.bankForm?.value?.bankFile) {
      formData.append('image', this.bankForm?.value?.bankFile);
    }
    formData.append('type', 'bank');
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditBank(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditBank: Subscription = this.banksService?.addEditBank(formData, this.bankId ? this.bankId : null).pipe(
      tap(res => this.handleAddEditBankSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditBank())
    ).subscribe();
    this.subscriptions.push(subscribeAddEditBank);
  }
  private handleAddEditBankSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddEditBank(): void {
  }
  // End Add/Edit Bank

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
    console.log(message);

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
