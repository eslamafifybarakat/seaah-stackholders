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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TuitionExpensesService } from '../../../services/tuitionExpenses.service';

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
  currentLanguage: string;

  // Levels Variables
  levels: any = [];
  isLoadingLevels: boolean = false;

  isEdit: boolean = false;
  tuitionId: number;
  tuitionData: any;

  tuitionForm = this.fb?.group(
    {
      title: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      details: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      level: ['', {
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
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.tuitionData = this.config.data;
    if (this.tuitionData.type == 'edit') {
      this.isEdit = true;
      this.tuitionId = this.tuitionData?.item?.id;
      this.patchValue();
    } else {
      // this.getInstallmentWays();
    }
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'العملاء',
      description: 'الاطفال',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.tuitionForm.patchValue({
      title: this.tuitionData?.item?.title,
      details: this.tuitionData?.item?.details,
    });
    this.getLevels();
  }

  // Start Levels List Functions
  getLevels(): void {
    this.isLoadingLevels = true;
    let levelsSubscription: Subscription = this.kidsService?.getLevelsList()
      .pipe(
        tap((res: any) => this.processLevelsListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeLevelsListLoading())
      ).subscribe();
    this.subscriptions.push(levelsSubscription);
  }
  private processLevelsListResponse(response: any): void {
    if (response) {
      this.levels = response?.data?.items;
      if (this.isEdit) {
        let patchLevel: any = [];
        this.levels.forEach((element: any) => {
          if (this.tuitionData.level.id == element.id) {
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
      { id: 1, level: 1 },
      { id: 2, level: 2 },
      { id: 3, level: 3 },
      { id: 4, level: 4 },
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
    let formData = new FormData();
    formData.append('title[en]', this.tuitionForm?.value?.title);
    formData.append('title[ar]', this.tuitionForm?.value?.title);
    formData.append('details[en]', this.tuitionForm?.value?.details);
    formData.append('details[ar]', this.tuitionForm?.value?.details);
    formData.append('level', this.tuitionForm?.value?.level['id']);
    formData.append('deserved_date', this.tuitionForm?.value?.deservedDate);
    formData.append('school_id', this.tuitionData.school_id);
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
