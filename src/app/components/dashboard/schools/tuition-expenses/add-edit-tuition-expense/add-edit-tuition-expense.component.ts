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
import { TuitionExpensesService } from '../../../services/tuitionExpenses.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { arabicCharactersValidator, englishCharactersValidator } from 'src/app/shared/configs/form-validators';

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
  selector: 'app-add-edit-tuition-expense',
  templateUrl: './add-edit-tuition-expense.component.html',
  styleUrls: ['./add-edit-tuition-expense.component.scss']
})
export class AddEditTuitionExpensesComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string | null;
  currentUserInformation: any | null;

  // Start Levels Variables
  levels: any = [
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "3", name: "3" },
    { id: "4", name: "4" },
    { id: "5", name: "5" },
    { id: "6", name: "6" },
    { id: "7", name: "7" },
    { id: "8", name: "8" },
    { id: "9", name: "9" }
  ];
  isLoadingLevels: boolean = false;
  // End Levels Variables

  isEdit: boolean = false;
  tuitionId: number;
  tuitionData: any;

  tuitionForm = this.fb?.group(
    {
      titleAr: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          arabicCharactersValidator() // Apply Arabic validator
        ], updateOn: "blur"
      }],
      titleEn: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          englishCharactersValidator() // Apply English validator
        ], updateOn: "blur"
      }],
      detailsAr: ['', {
        validators: [
          Validators.required,
          arabicCharactersValidator() // Apply Arabic validator
        ], updateOn: "blur"
      }],
      detailsEn: ['', {
        validators: [
          Validators.required,
          englishCharactersValidator() // Apply English validator
        ], updateOn: "blur"
      }],
      price: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      level: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      deservedDate: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.tuitionForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private tuitionExpensesService: TuitionExpensesService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private kidsService: KidsService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.tuitionData = this.config.data;
    if (this.tuitionData.type == 'edit') {
      this.isEdit = true;
      this.tuitionId = this.tuitionData?.item?.id;
      this.patchValue();
    }
    // this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'إضافة مصروف',
      description: 'إضافة مصروف',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    let patchedDate: any = new Date(this.tuitionData?.item?.deserved_date);
    console.log(this.tuitionData?.item);
    this.tuitionForm.patchValue({
      titleAr: this.tuitionData?.item?.titleAR,
      titleEn: this.tuitionData?.item?.titleEN,
      detailsAr: this.tuitionData?.item?.detailsAR,
      detailsEn: this.tuitionData?.item?.detailsEN,
      price: this.tuitionData?.item?.total,
      deservedDate: patchedDate
    });
    this.getLevels();
  }

  // Start Levels List Functions
  getLevels(): void {
    if (this.isEdit) {
      let patchLevel: any;
      this.levels.forEach((element: any) => {
        if (this.tuitionData?.item?.level == element?.id) {
          patchLevel = element;
        }
      });
      this.tuitionForm.get('level').setValue(patchLevel);
    }
    // this.isLoadingLevels = true;
    // let levelsSubscription: Subscription = this.kidsService?.getLevelsList()
    //   .pipe(
    //     tap((res: any) => this.processLevelsListResponse(res)),
    //     catchError(err => this.handleError(err)),
    //     finalize(() => this.finalizeLevelsListLoading())
    //   ).subscribe();
    // this.subscriptions.push(levelsSubscription);
  }
  private processLevelsListResponse(response: any): void {
    if (response) {
      this.levels = response?.data?.items;
      if (this.isEdit) {
        let patchLevel: any = [];
        this.levels.forEach((element: any) => {
          if (this.tuitionData?.level?.id == element.id) {
            patchLevel.push(element);
          }
        });
        this.tuitionForm.get('level').setValue(patchLevel);
      }
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeLevelsListLoading(): void {
    this.isLoadingLevels = false;
    this.levels = [
      { id: 1, level: 'level 1' },
      { id: 2, level: 'level 2' },
      { id: 3, level: 'level 3' },
      { id: 4, level: 'level 4' },
    ]
  }
  // End Levels List Functions

  // Start Add Edit Tuition
  submit(): void {
    if (this.tuitionForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditTuition(formData);
    } else {
      this.publicService?.validateAllFormFields(this.tuitionForm);
    }
  }
  private extractFormData(): any {
    let kidFormData: any = this.tuitionForm?.value;
    // Convert string to Date object if necessary
    const dateObject: any = new Date(kidFormData?.deservedDate);
    const formattedDate: any = dateObject?.toLocaleDateString('en-CA');

    let formData = new FormData();
    formData.append('title[en]', kidFormData?.titleEn);
    formData.append('title[ar]', kidFormData?.titleAr);
    formData.append('details[ar]', kidFormData?.detailsAr);
    formData.append('details[en]', kidFormData?.detailsEn);
    formData.append('deserved_date', formattedDate);
    formData.append('level', kidFormData?.level?.id ?? '');
    formData.append('total', kidFormData?.price ?? null);
    formData.append('school_id', this.currentUserInformation?.organization?.id);
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditTuition(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditTuition: Subscription = this.tuitionExpensesService?.addEditTuitionExpense(formData, this.tuitionId ? this.tuitionId : null).pipe(
      tap(res => this.handleAddEditTuitionSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditTuition);
  }
  private handleAddEditTuitionSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add Edit Tuition

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
