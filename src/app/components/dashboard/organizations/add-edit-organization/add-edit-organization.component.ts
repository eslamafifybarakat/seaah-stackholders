// Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { FileUploadComponent } from '../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { OrganizationsListApiResponse } from '../../../../interfaces/dashboard/organizations';
import { InstallmentWaysListingItem } from '../../../../interfaces/dashboard/installmentWays';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { OrganizationsService } from '../../services/organizations.service';
import { AlertsService } from '../../../../services/generic/alerts.service';
import { PublicService } from '../../../../services/generic/public.service';
import { InstallmentWaysService } from '../../services/installment-ways.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  selector: 'app-add-edit-organization',
  templateUrl: './add-edit-organization.component.html',
  styleUrls: ['./add-edit-organization.component.scss']
})
export class AddEditOrganizationComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  //  Installment Ways Variables
  installmentWays: InstallmentWaysListingItem[] = [];
  isLoadingInstallmentWays: boolean = false;

  minEndTime: any;

  isEdit: boolean = false;
  organizationId: number;
  organizationData: any;

  organizationFile: any = null;
  organizationFileSrc: any;

  organizationForm = this.fb?.group(
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
      organizationFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.organizationForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private organizationsService: OrganizationsService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.organizationData = this.config.data;
    if (this.organizationData.type == 'edit') {
      this.isEdit = true;
      this.organizationId = this.organizationData?.item?.id;
      this.patchValue();
    } else {
      this.getInstallmentWays();
    }
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'العملاء',
      description: 'العملاء',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.organizationForm.patchValue({
      name: this.organizationData?.item?.name,
      location: this.organizationData?.item?.location,
      startTime: this.convertTime(this.organizationData?.item?.start_time),
      endTime: this.convertTime(this.organizationData?.item?.end_time),
    });
    this.organizationFileSrc = this.organizationData?.item?.image_path;
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
    this.installmentWaysService?.getInstallmentWaysList()
      .pipe(
        tap((res: OrganizationsListApiResponse) => this.processInstallmentWaysListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeInstallmentWaysListLoading())
      ).subscribe();
  }
  private processInstallmentWaysListResponse(response: any): void {
    if (response) {
      this.installmentWays = response?.data?.items;
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeInstallmentWaysListLoading(): void {
    this.isLoadingInstallmentWays = false;
  }
  // End Installment Ways List Functions

  // Upload File
  uploadFile(event: any): void {
    this.organizationFile = event.file;
    this.organizationForm.get('organizationFile').setValue(this.organizationFile);
  }

  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.organizationForm?.get('endTime')?.reset();
  }
  clearStartTime(): void {
    this.organizationForm?.get('endTime')?.reset();
  }

  // Start Add New Client
  submit(): void {
    if (this.organizationForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditOrganization(formData);
    } else {
      this.publicService?.validateAllFormFields(this.organizationForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    let installmentWays: any = this.organizationForm.value.installmentWays;
    let startTime: any = this.organizationForm?.value?.startTime;
    let endTime: any = this.organizationForm?.value?.endTime;
    const installmentWaysValues = `{${installmentWays.map((obj: any) => obj.id).join(',')}}`;
    formData.append('name[en]', this.organizationForm?.value?.name);
    formData.append('name[ar]', this.organizationForm?.value?.name);
    formData.append('location[en]', this.organizationForm?.value?.location);
    formData.append('location[ar]', this.organizationForm?.value?.location);
    formData.append('start_time', startTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('end_time', endTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('installment_ways', JSON.stringify(installmentWaysValues));
    formData.append('image', this.organizationForm?.value?.organizationFile);
    formData.append('type', this.organizationData.typeValue);
    return formData;
  }
  private addEditOrganization(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddOrganization: Subscription = this.organizationsService?.addEditOrganization(formData, this.organizationId ? this.organizationId : null).pipe(
      tap(res => this.handleAddEditOrganizationSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddOrganization);
  }
  private handleAddEditOrganizationSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add New Client

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }
  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
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
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
