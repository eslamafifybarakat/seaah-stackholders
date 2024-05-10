// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { DynamicSvgComponent } from '../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { AddEditUniversityComponent } from '../add-edit-university/add-edit-university.component';
import { SkeletonComponent } from '../../../../../shared/skeleton/skeleton/skeleton.component';
import { UsersListComponent } from '../../../users/users-list/users-list.component';
import { RecordsComponent } from '../../../records/records.component';

//Services
import { LocalizationLanguageService } from '../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { UniversitiesService } from './../../../services/universities.service';
import { UniversityDetails, UniversityDetailsApiResponse } from 'src/app/interfaces/dashboard/universities';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, catchError, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';

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
    DynamicSvgComponent,
    UsersListComponent,
    SkeletonComponent,
    RecordsComponent,
  ],
  selector: 'app-university-details',
  templateUrl: './university-details.component.html',
  styleUrls: ['./university-details.component.scss']
})
export class UniversityDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  dataStyleType: string = 'list';

  universityId: number;
  isLoading: boolean = false;
  universityData: UniversityDetails;

  universityForm = this.fb?.group(
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
    return this.universityForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private universitiesService: UniversitiesService,
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
      this.universityId = params['id'];
      if (this.universityId) {
        this.getUniversityById(this.universityId);
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل الجامعة',
      description: 'تفاصيل الجامعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  // Start Patch Values
  patchValue(): void {
    this.universityForm.patchValue({
      name: this.universityData?.name,
      location: this.universityData?.location,
      startTime: this.convertTime(this.universityData?.start_time),
      endTime: this.convertTime(this.universityData?.end_time)
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

  // Start Get University By Id
  getUniversityById(id: number | string): void {
    this.isLoading = true;
    let subscribeGetUniversity: Subscription = this.universitiesService?.getUniversityById(id).pipe(
      tap((res: UniversityDetailsApiResponse) => this.handleGetUniversitySuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeGetUniversity())
    ).subscribe();
    this.subscriptions.push(subscribeGetUniversity);
  }
  private handleGetUniversitySuccess(response: UniversityDetailsApiResponse): void {
    if (response?.status == 200) {
      this.universityData = response.data;
      this.patchValue();
      this.isLoading = false;
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeGetUniversity(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  // End Get University By Id

  // Edit University
  editItem(): void {
    const ref = this.dialogService?.open(AddEditUniversityComponent, {
      data: {
        item: this.universityData,
        type: 'edit',
      },
      header: this.publicService?.translateTextFromJson('dashboard.banks.editBank'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getUniversityById(this.universityId);
      }
    });
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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
