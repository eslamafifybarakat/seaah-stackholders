import { BanksListApiResponse } from '../../../../../interfaces/dashboard/banks';
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
import { AddEditUniversityApiResponse } from 'src/app/interfaces/dashboard/universities';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UniversitiesService } from '../../../services/universities.service';
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
  selector: 'app-add-edit-university',
  templateUrl: './add-edit-university.component.html',
  styleUrls: ['./add-edit-university.component.scss']
})
export class AddEditUniversityComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  minEndTime: any;

  isEdit: boolean = false;
  universityId: number;
  universityData: any;

  universityFile: any = null;
  universityFileSrc: any;

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
      universityFile: [null, {
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
    this.universityData = this.config.data;
    if (this.universityData.type == 'edit') {
      this.isEdit = true;
      this.universityId = this.universityData?.item?.id;
      this.patchValue();
      if (this.isEdit) {
        // Remove the required validator from the bankFile control
        const universityFileControl = this.universityForm.get('universityFile');
        if (universityFileControl) {
          universityFileControl.clearValidators(); // Remove all validators
          universityFileControl.updateValueAndValidity(); // Update control to reflect changes
        }
      }
    }
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الجامعات',
      description: 'الجامعات',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.universityForm.patchValue({
      name: this.universityData?.item?.name,
      location: this.universityData?.item?.location,
      startTime: this.convertTime(this.universityData?.item?.start_time),
      endTime: this.convertTime(this.universityData?.item?.end_time),
    });
    this.universityFileSrc = this.universityData?.item?.image_path;
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
    this.universityFile = event.file;
    this.universityForm.get('universityFile').setValue(this.universityFile);
  }

  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.universityForm?.get('endTime')?.reset();
  }
  clearStartTime(): void {
    this.universityForm?.get('endTime')?.reset();
  }

  // Start Add University
  submit(): void {
    if (this.universityForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditUniversity(formData);
    } else {
      this.publicService?.validateAllFormFields(this.universityForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    let startTime: any = this.universityForm?.value?.startTime;
    let endTime: any = this.universityForm?.value?.endTime;
    formData.append('name[en]', this.universityForm?.value?.name);
    formData.append('name[ar]', this.universityForm?.value?.name);
    formData.append('location[en]', this.universityForm?.value?.location);
    formData.append('location[ar]', this.universityForm?.value?.location);
    formData.append('start_time', startTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('end_time', endTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('type', 'university');
    if (this.universityForm?.value?.universityFile) {
      formData.append('image', this.universityForm?.value?.universityFile);
    }
    if (this.isEdit) {
    formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditUniversity(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditUniversity: Subscription = this.universitiesService?.addEditUniversity(formData, this.universityId ? this.universityId : null).pipe(
      tap((res:AddEditUniversityApiResponse) => this.handleAddEditUniversitySuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditUniversity())
    ).subscribe();
    this.subscriptions.push(subscribeAddEditUniversity);
  }
  private handleAddEditUniversitySuccess(response: AddEditUniversityApiResponse): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddEditUniversity(): void {
  }
  // End Add University

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
