import { KidsService } from './../../../services/kids.service';

// Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { FileUploadComponent } from '../../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { SchoolsService } from '../../../services/schools.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-add-expenses',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    MultiSelectModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss']
})
export class AddExpensesComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  // Start Schools Variables
  schools: any = [];
  isLoadingSchools: boolean = false;
  // End Schools Variables

  kidData: any;

  kidForm = this.fb?.group(
    {
      school: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.kidForm?.controls;
  }

  currentUserInformation: any | null;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private schoolsService: SchoolsService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private authService: AuthService,
    private kidsService: KidsService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.kidData = this.config.data;
    this.getSchools();
    // this.updateMetaTagsForSEO();
    this.getCurrentUserInfo();
  }
  getCurrentUserInfo(): void {
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'إضافة مصاريف',
      description: 'إضافة مصاريف',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start Schools List Functions
  getSchools(): void {
    this.isLoadingSchools = true;
    let schoolsSubscription: Subscription = this.schoolsService?.getSchoolsList()
      .pipe(
        tap((res: any) => {
          this.processSchoolsListResponse(res)
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeSchoolsListLoading())
      ).subscribe();
    this.subscriptions.push(schoolsSubscription);
  }
  private processSchoolsListResponse(response: any): void {
    if (response) {
      this.schools = response?.data?.items;
      this.schools?.forEach((item: any) => {
        let name: any = JSON.parse(item?.name || "{}");
        item['schoolName'] = name[this.currentLanguage];
      });

      let patchSchool: any;
      this.schools?.forEach((element: any) => {
        if (this.kidData?.item?.school?.id == element?.id) {
          patchSchool = element;
        }
      });
      this.kidForm?.get('school')?.setValue(patchSchool);
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeSchoolsListLoading(): void {
    this.schools=[{id:1,schoolName:'schoolName'},{id:2,schoolName:'schoolName'}]
    this.isLoadingSchools = false;
  }
  // End Schools List Functions

  // Start Add Edit Kid
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
    console.log(kidFormData);
    let formData = new FormData();
    formData.append('name', kidFormData?.school ?? '');
    formData.append('parent_id', this.currentUserInformation?.id);
    return formData;
  }
  private addEditKid(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddKid: Subscription = this.kidsService?.addEditKid(formData).pipe(
      tap(res => this.handleAddKidSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddKid);
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
