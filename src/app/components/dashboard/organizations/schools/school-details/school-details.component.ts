// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { DynamicSvgComponent } from '../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from '../../../../../shared/skeleton/skeleton/skeleton.component';
import { AddEditSchoolComponent } from '../add-edit-school/add-edit-school.component';
import { UsersListComponent } from '../../../users/users-list/users-list.component';
import { RecordsComponent } from '../../../records/records.component';

//Services
import { LocalizationLanguageService } from '../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolDetailsApiResponse } from 'src/app/interfaces/dashboard/schools';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { SchoolsService } from './../../../services/schools.service';
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
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss']
})
export class SchoolDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  dataStyleType: string = 'list';

  schoolId: number;
  isLoadingGetShool: boolean = false;
  schoolData: any;

  schoolForm = this.fb?.group(
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
      }]
    }
  );
  get formControls(): any {
    return this.schoolForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
    private schoolsService: SchoolsService,
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
      this.schoolId = params['id'];
      if (this.schoolId) {
        this.getSchoolById(this.schoolId);
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل المدرسة',
      description: 'الوصف',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  // Start Patch Values
  patchValue(): void {
    this.schoolForm.patchValue({
      name: this.schoolData?.name,
      location: this.schoolData?.location,
      startTime: this.convertTime(this.schoolData?.start_time),
      endTime: this.convertTime(this.schoolData?.end_time)
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

  // Start Get School By Id
  getSchoolById(id: number | string): void {
    this.isLoadingGetShool = true;
    let subscribeGetSchool: Subscription = this.schoolsService?.getSchoolById(id).pipe(
      tap((res:SchoolDetailsApiResponse) => this.handleGetSchoolSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeGetSchool())
    ).subscribe();
    this.subscriptions.push(subscribeGetSchool);
  }
  private handleGetSchoolSuccess(response: SchoolDetailsApiResponse): void {
    if (response?.status == 200) {
      this.schoolData = response.data;
      this.patchValue();
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeGetSchool(): void {
    this.isLoadingGetShool=false;
  }
  // End Get School By Id

  // Edit School
  editItem(): void {
    const ref = this.dialogService?.open(AddEditSchoolComponent, {
      data: {
        item: this.schoolData,
        type: 'edit',
      },
      header: this.publicService?.translateTextFromJson('dashboard.schools.editSchool'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getSchoolById(this.schoolId);
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
