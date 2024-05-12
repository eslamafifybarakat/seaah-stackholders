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
import { tap, catchError, finalize } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchoolsService } from '../../../services/schools.service';

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

  // Levels Variables
  levels: any = [];
  schools: any =  [
    { id: 1, school: 'school 1' },
    { id: 2, school: 'school 2' },
    { id: 3, school: 'school 3' },
    { id: 4, school: 'school 4' },
  ];
  isLoadingLevels: boolean = false;
  isLoadingSchools: boolean = false;

  // Levels Variables
  statuses: any = [];
  isLoadingStatuses: boolean = false;

  isEdit: boolean = false;
  kidId: number;
  kidData: any;
  schoolData: any;

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
      address: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      level: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      class: ['', {
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

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private kidsService: KidsService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private schoolsService: SchoolsService,
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
    }
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الاطفال',
      description: 'الاطفال',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.kidForm.patchValue({
      name: this.kidData?.item?.name,
      code: this.kidData?.item?.code,
      level: this.kidData?.item?.level,
      class: this.kidData?.item?.class,
      // paidStatus: this.kidData?.item?.paid_status,
      address: this.kidData?.item?.address,
    });
    this.kidImageSrc = this.kidData?.item?.image_path;
    this.getLevels();
  }

  // Start Levels List Functions
  getLevels(): void {
    if (this.isEdit) {
      let patchLevel: any = [];
      this.levels.forEach((element: any) => {
        if (this.kidData.level.id == element.id) {
          patchLevel.push(element);
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

    // Start Schools List Functions
    getSchools(): void {
      this.isLoadingSchools = true;
      let schoolsSubscription: Subscription = this.schoolsService?.getSchoolsList()
        .pipe(
          tap((res: any) => {
            console.log("schooooooooools " , res);
            
            this.processSchoolsListResponse(res)}),
          catchError(err => this.handleError(err)),
          finalize(() => this.finalizeSchoolsListLoading())
        ).subscribe();
      this.subscriptions.push(schoolsSubscription);
    }
    private processSchoolsListResponse(response: any): void {
      if (response) {
        this.schools = response?.data?.items;
        if (this.isEdit) {
          let patchLevel: any = [];
          this.schools?.forEach((element: any) => {
            if (this.schoolData?.school?.id == element.id) {
              patchLevel.push(element);
            }
          });
          this.kidForm?.get('school')?.setValue(patchLevel);
        }
      } else {
        this.handleError(response.error);
        return;
      }
    }
    private finalizeSchoolsListLoading(): void {
      console.log("finalizeSchoolsListLoading");
      
      this.isLoadingSchools = false;
      this.schools = [
        { id: 1, school: 'school 1' },
        { id: 2, school: 'school 2' },
        { id: 3, school: 'school 3' },
        { id: 4, school: 'school 4' },
      ]
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
    let formData = new FormData();
    formData.append('name', this.kidForm?.value?.name);
    formData.append('code', this.kidForm?.value?.code);
    formData.append('level', this.kidForm?.value?.level);
    formData.append('class', this.kidForm?.value?.class);
    formData.append('address', this.kidForm?.value?.address);
    formData.append('image', this.kidForm?.value?.kidImage);
    formData.append('paid_status', '0');
    formData.append('school_id', this.kidData.school);
    formData.append('parent_id', this.kidData.parent_id); 
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
