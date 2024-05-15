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
  selector: 'app-add-edit-kid',
  templateUrl: './add-edit-kid.component.html',
  styleUrls: ['./add-edit-kid.component.scss']
})
export class AddEditKidComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

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

  // Start Classes Variables
  classes: any = [
    { id: "A", name: "A" },
    { id: "B", name: "B" }
  ];
  isLoadingClasses: boolean = false;
  // End Classes Variables

  // Start Schools Variables
  schools: any = [];
  isLoadingSchools: boolean = false;
  // End Schools Variables

  statuses: any = [];
  isLoadingStatuses: boolean = false;

  isEdit: boolean = false;
  kidId: number;
  kidData: any;

  kidImage: any = null;
  kidImageSrc: any;
  englishAndNumbersPattern = /^[a-zA-Z0-9\s]*$/;

  kidForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      code: ['', {
        validators: [
          Validators.required,
          Validators.pattern(this.englishAndNumbersPattern)
        ], updateOn: "blur",

      }],
      school: [null, {
        validators: [
          Validators.required]
      }],
      city: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      region: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      street: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      level: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      class: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      kidImage: [null, {
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
    if (this.kidData.type == 'edit') {
      this.isEdit = true;
      this.kidId = this.kidData?.item?.id;
      this.patchValue();
    } else {
      this.getLevels();
      this.getSchools();
      this.getClasses();
    }
    // this.updateMetaTagsForSEO();
    this.getCurrentUserInfo();
  }
  getCurrentUserInfo(): void {
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الاطفال',
      description: 'الاطفال',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start Patch Values
  private patchValue(): void {
    this.kidForm.patchValue({
      name: this.kidData?.item?.name,
      code: this.kidData?.item?.code,
    });
    this.kidImageSrc = this.kidData?.item?.image_path;
    this.patchStreet(this.kidData?.item?.address);
    this.getSchools();
    this.getLevels();
    this.getClasses();

    let formPhoto: any = this.kidData?.item?.image_path;
    this.formControls?.kidImage?.setValue(formPhoto);
  }
  private patchStreet(data: any): void {
    this.kidForm.patchValue({
      city: data?.city,
      region: data?.region || '',
      street: data?.street
    });
  }
  // End Patch Values

  // Start Levels List Functions
  getLevels(): void {
    if (this.isEdit) {
      let patchLevel: any;
      this.levels.forEach((element: any) => {
        if (this.kidData?.item?.level == element?.id) {
          patchLevel = element;
        }
      });
      this.kidForm.get('level').setValue(patchLevel);
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
          if (this.kidData.level.id == element.id) {
            patchLevel.push(element);
          }
        });
        this.kidForm.get('level').setValue(patchLevel);
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

  // Start Class List Functions
  getClasses(): void {
    if (this.isEdit) {
      let patchClass: any;
      this.classes?.forEach((element: any) => {
        if (this.kidData?.item?.class == element?.id) {
          patchClass = element;
        }
      });
      this.kidForm?.get('class')?.setValue(patchClass);
    }
    // this.isLoadingClasses = true;
    // let classesSubscription: Subscription = this.kidsService?.getClassesList()
    //   .pipe(
    //     tap((res: any) => this.processClassesListResponse(res)),
    //     catchError(err => this.handleError(err)),
    //     finalize(() => this.finalizeClassesListLoading())
    //   ).subscribe();
    // this.subscriptions.push(classesSubscription);
  }
  private processClassesListResponse(response: any): void {
    if (response) {
      this.levels = response?.data?.items;
      if (this.isEdit) {
        let patchLevel: any = [];
        this.levels.forEach((element: any) => {
          if (this.kidData.level.id == element.id) {
            patchLevel.push(element);
          }
        });
        this.kidForm.get('level').setValue(patchLevel);
      }
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeClassesListLoading(): void {
    this.isLoadingClasses = false;
  }
  // End Class List Functions

  // Start Schools List Functions
  getSchools(): void {
    this.isLoadingSchools = true;
    let schoolsSubscription: Subscription = this.schoolsService?.getSchoolsList("all")
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
      })

      if (this.isEdit) {
        let patchSchool: any;
        this.schools?.forEach((element: any) => {
          if (this.kidData?.item?.school?.id == element?.id) {
            patchSchool = element;
          }
        });
        this.kidForm?.get('school')?.setValue(patchSchool);
      }
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeSchoolsListLoading(): void {
    this.isLoadingSchools = false;
  }
  // End Schools List Functions

  // Upload File
  uploadFile(event: any): void {
    this.kidImage = event.file;
    this.kidForm.get('kidImage').setValue(this.kidImage);
  }

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
    let formData = new FormData();
    formData.append('name', kidFormData?.name ?? '');
    formData.append('code', kidFormData?.code ?? '');
    formData.append('school_id', kidFormData?.school?.id);
    formData.append('class', kidFormData?.class?.id ?? '');
    formData.append('level', kidFormData?.level?.id ?? '');
    formData.append('address[region]', kidFormData?.region ?? '');
    formData.append('address[city]', kidFormData?.city ?? '');
    formData.append('address[street]', kidFormData?.region ?? '');
    formData.append('address[zip]', '14552');
    if (this.isEdit) {
      let photo: any = this.kidForm?.value?.kidImage;
      let paidStatusVal: any = this.kidData?.item?.paid_status == true ? 1 : 0;
      photo?.name != null ? formData.append('image', this.kidImage) : '';
      formData.append('_method', 'PUT');
      formData.append('paid_status', paidStatusVal);
    } else {
      let paidStatusVal: any = 0;
      formData.append('image', this.kidImage ?? '');
      formData.append('paid_status', paidStatusVal);
    }
    formData.append('parent_id', this.currentUserInformation?.id);
    return formData;
  }
  private addEditKid(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddKid: Subscription = this.kidsService?.addEditKid(formData, this.kidId ? this.kidId : null).pipe(
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
