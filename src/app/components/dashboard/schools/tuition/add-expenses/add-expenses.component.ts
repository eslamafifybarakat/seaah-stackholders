import { SkeletonComponent } from 'src/app/shared/skeleton/skeleton/skeleton.component';
import { DynamicSvgComponent } from './../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';

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
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { KidsTuitionsService } from '../../../services/kids-tuitions.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/authentication/auth.service';
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
    FormsModule,

    // Components
    DynamicSvgComponent,
    SkeletonComponent,
  ],
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss']
})
export class AddExpensesComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  // Start Tuition Expenses List Variables
  isLoadingTuitionExpensesList: boolean = false;
  tuitionExpensesList: any[] = [];
  tuitionExpensesCount: number = 0;
  // End Tuition Expenses List Variables

  tuitionExpensesData: any;
  kidId: any;
  selectedExpenses: any = [];

  tuitionExpensesForm = this.fb?.group(
    {
      tuitionExpenses: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.tuitionExpensesForm?.controls;
  }

  currentUserInformation: any | null;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private tuitionExpensesService: TuitionExpensesService,
    private kidsTuitionsService: KidsTuitionsService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.tuitionExpensesData = this.config.data;
    this.kidId = this.tuitionExpensesData?.event?.id;
    this.getAllTuitionExpenses();
    // this.updateMetaTagsForSEO();
    this.getCurrentUserInfo();
    this.tuitionExpensesForm.get('tuitionExpenses').valueChanges.subscribe(value => {
      this.selectedExpenses = value;
    });

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

  // Start Tuition Expenses List Functions
  getAllTuitionExpenses(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showGlobalLoader.next(true) : this.isLoadingTuitionExpensesList = true;
    let tuitionSubscription: Subscription = this.tuitionExpensesService?.getTuitionExpensesList(null, null, null, null, null, null, this.kidId)
      .pipe(
        tap((res: any) => this.processTuitionExpensesListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeTuitionExpenseListLoading())
      ).subscribe();
    this.subscriptions.push(tuitionSubscription);

  }
  private processTuitionExpensesListResponse(response: any): void {
    if (response.status == 200) {
      this.tuitionExpensesCount = response?.data?.total;
      this.tuitionExpensesList = response?.data?.items;
      this.tuitionExpensesList?.forEach((item: any) => {
        item['titleName'] = item?.title[this.currentLanguage];
        item['titleAR'] = item?.title['ar'];
        item['titleEN'] = item?.title['en'];
        item['detailsName'] = item?.details[this.currentLanguage];
        item['detailsAR'] = item?.details['ar'];
        item['detailsEN'] = item?.details['en'];
      });
      if (this.tuitionExpensesData?.event?.expenses && this.tuitionExpensesData?.event?.expenses?.length > 0) {
        let expensesPatch: any = [];
        this.tuitionExpensesData?.event?.expenses?.forEach((expense: any) => {
          this.tuitionExpensesList?.forEach((item: any) => {
            if (expense?.id == item?.id) {
              expensesPatch?.push(item);
            }
          });
        });
        this.tuitionExpensesForm.patchValue({
          tuitionExpenses: expensesPatch
        });
        this.selectedExpenses = expensesPatch;
      }
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeTuitionExpenseListLoading(): void {
    this.isLoadingTuitionExpensesList = false;
  }
  // End Tuition Expenses List Functions
  totalExpenses(): any {
    let total: any = 0;
    this.selectedExpenses?.forEach((element: any) => {
      total = total + +element?.total;
    });
    return total;
  }
  // Start Add Edit Tuition Expenses
  submit(): void {
    if (this.tuitionExpensesForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditKidTuitionsData(formData);
    } else {
      this.publicService?.validateAllFormFields(this.tuitionExpensesForm);
    }
  }
  private extractFormData(): any {
    let tuitionExpensesFormData: any = this.tuitionExpensesForm?.value;
    let selectedIds: any = [];
    tuitionExpensesFormData?.tuitionExpenses?.forEach((element: any) => {
      selectedIds?.push(element.id);
    });
    // let formData = new FormData();
    // formData.append('expenses_ids', selectedIds);
    let objData: any = {};
    objData = {
      expenses_ids: selectedIds
    }
    return objData;
  }
  private addEditKidTuitionsData(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddKidTuition: Subscription = this.kidsTuitionsService?.addEditKidTuitions(formData, this.tuitionExpensesData?.event?.id).pipe(
      tap(res => this.handleAddKidSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddKidTuition);
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
  // End Add Edit Tuition Expenses

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
