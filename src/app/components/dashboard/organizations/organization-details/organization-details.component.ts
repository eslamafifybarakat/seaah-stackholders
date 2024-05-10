// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { SkeletonComponent } from '../../../../shared/skeleton/skeleton/skeleton.component';
import { AddEditOrganizationComponent } from '../add-edit-organization/add-edit-organization.component';
import { RecordsComponent } from '../../records/records.component';

//Services
import { LocalizationLanguageService } from '../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationsService } from './../../services/organizations.service';
import { AlertsService } from '../../../../services/generic/alerts.service';
import { PublicService } from '../../../../services/generic/public.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, catchError, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    CommonModule,
    FormsModule,

    // Components
    UploadMultiFilesComponent,
    SkeletonComponent,
    RecordsComponent,
  ],
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  organizationId: number;
  isLoading: boolean = false;
  organizationData: any;
  organizationType: string = '';

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
    private organizationsService: OrganizationsService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private fb: FormBuilder,
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.loadPageData();
  }

  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.activatedRoute.params.subscribe((params) => {
      this.organizationId = params['id'];
      this.organizationType = params['type'];
      if (this.organizationId) {
        this.getOrganizationById(this.organizationId);
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل المنظمة',
      description: 'الوصف',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start Patch Values
  patchValue(): void {
    var locationObj = JSON.parse(this.organizationData.location);
    this.organizationData['location'] = locationObj[this.currentLanguage];
    var nameObj = JSON.parse(this.organizationData.name);
    this.organizationData['name'] = nameObj[this.currentLanguage];
    this.organizationForm.patchValue({
      name: this.organizationData?.name,
      location: this.organizationData?.location,
      startTime: this.convertTime(this.organizationData?.start_time),
      endTime: this.convertTime(this.organizationData?.end_time),
      installmentWays: this.organizationData?.installment_ways,
    });
  }
  convertTime(date: any): any {
    const timeString = date;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateTimeString = `${dateString}T${timeString}`;
    const time: any = new Date(dateTimeString);
    return time;
  }
  // End Patch Values

  // Start Get Organization By Id
  getOrganizationById(id: number | string): void {
    this.isLoading = true;
    let subscribeGetOrganization: Subscription = this.organizationsService?.getOrganizationById(id).pipe(
      tap(res => this.handleGetOrganizationSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeGetOrganization);
  }
  private handleGetOrganizationSuccess(response: any): void {
    if (response?.status == 200) {
      this.organizationData = response.data;
      this.patchValue();
      this.isLoading = false;
    } else {
      this.handleError(response?.message);
    }
  }
  // End Get Organization By Id

  // Edit Organizations
  editItem(): void {
    const ref = this.dialogService?.open(AddEditOrganizationComponent, {
      data: {
        item: this.organizationData,
        type: 'edit',
        typeValue: this.organizationType
      },
      header: this.organizationType == 'bank' ? this.publicService?.translateTextFromJson('dashboard.banks.editBank') : this.organizationType == 'school' ? this.publicService?.translateTextFromJson('dashboard.schools.editSchool') : this.publicService?.translateTextFromJson('dashboard.universities.editUniversity'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getOrganizationById(this.organizationId);
      }
    });
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
