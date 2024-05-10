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
import { SchoolItemData, SchoolItemDataApiResponse } from 'src/app/interfaces/dashboard/schools';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  selector: 'app-add-edit-school',
  templateUrl: './add-edit-school.component.html',
  styleUrls: ['./add-edit-school.component.scss']
})
export class AddEditSchoolComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  minEndTime: any;

  isEdit: boolean = false;
  schoolId: number;
  schoolData: SchoolItemData | any;

  schoolFile: any = null;
  schoolFileSrc: any;

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
      }],
      schoolFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.schoolForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private schoolsService: SchoolsService,
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
    this.schoolData = this.config.data;
    if (this.schoolData.type == 'edit') {
      this.isEdit = true;
      this.schoolId = this.schoolData?.item?.id;
      this.patchValue();
    }
    this.updateMetaTagsForSEO();
    if (this.isEdit) {
      // Remove the required validator from the bankFile control
      const shoolFileControl = this.schoolForm.get('schoolFile');
      if (shoolFileControl) {
        shoolFileControl.clearValidators(); // Remove all validators
        shoolFileControl.updateValueAndValidity(); // Update control to reflect changes
      }
    }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'المدارس',
      description: 'المدارس',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.schoolForm.patchValue({
      name: this.schoolData?.item?.name,
      location: this.schoolData?.item?.location,
      startTime: this.convertTime(this.schoolData?.item?.start_time),
      endTime: this.convertTime(this.schoolData?.item?.end_time),
    });
    this.schoolFileSrc = this.schoolData?.item?.image_path;
  }
  convertTime(date: any): any {
    const timeString = date;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateTimeString = `${dateString}T${timeString}`;
    const time: any = new Date(dateTimeString);
    return time;
  }

  // Upload File
  uploadFile(event: any): void {
    this.schoolFile = event.file;
    this.schoolForm.get('schoolFile').setValue(this.schoolFile);
  }

  // Start Time Functions
  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.schoolForm?.get('endTime')?.reset();
  }
  clearStartTime(): void {
    this.schoolForm?.get('endTime')?.reset();
  }
  // End Time Functions

  // Start Add School Functions
  submit(): void {
    if (this.schoolForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditSchool(formData);
    } else {
      this.publicService?.validateAllFormFields(this.schoolForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    let startTime: any = this.schoolForm?.value?.startTime;
    let endTime: any = this.schoolForm?.value?.endTime;
    formData.append('name[en]', this.schoolForm?.value?.name);
    formData.append('name[ar]', this.schoolForm?.value?.name);
    formData.append('location[en]', this.schoolForm?.value?.location);
    formData.append('location[ar]', this.schoolForm?.value?.location);
    formData.append('start_time', startTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('end_time', endTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('type', 'school');
    if (this.schoolForm?.value?.schoolFile) {
      formData.append('image', this.schoolForm?.value?.schoolFile);
    }
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditSchool(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddSchool: Subscription = this.schoolsService?.addEditSchool(formData, this.schoolId ? this.schoolId : null).pipe(
      tap((res: any) => this.handleAddEditSchoolSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditSchool())
    ).subscribe();
    this.subscriptions.push(subscribeAddSchool);
  }
  private handleAddEditSchoolSuccess(response: any): void {
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddEditSchool(): void {
    this.publicService?.showGlobalLoader?.next(false);
  }
  // End Add School Functions

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
