// Components
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';

// Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { AlertsService } from '../../../services/generic/alerts.service';
import { PublicService } from '../../../services/generic/public.service';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { patterns } from 'src/app/shared/configs/patterns';
@Component({
  standalone: true,
  imports: [
    // Components
    LanguageSelectorComponent,

    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  selector: 'registration-v1',
  templateUrl: './registration-v1.component.html',
  styleUrls: ['./registration-v1.component.scss']
})
export class RegistrationV1Component {
  private subscriptions: Subscription[] = [];

  registerationForm = this.fb.group({
    name: ['', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)], updateOn: 'blur' }],
    nationalIdentify: ['', { validators: [Validators.required, Validators.pattern('^[0-9]*$')], updateOn: 'blur' }],// ensures only numeric values
    phone: ['', { validators: [Validators.required, Validators.pattern('^[0-10]*$')], updateOn: 'blur' }],// ensures only numeric values
    email: ['', { validators: [Validators.required, Validators.pattern(patterns?.email)], updateOn: 'blur' }],
  });
  get formControls(): any {
    return this.registerationForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private authService: AuthService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تسجيل الدخول',
      description: 'تسجيل الدخول',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start Register Functions
  registerNow(): void {
    if (this.registerationForm?.valid) {
      this.publicService.showGlobalLoader.next(true);
      const data: any = this.excuteDataForm();
      //Send Request to login
      let registerSubscription: Subscription = this.authService?.registerParent(data)?.pipe(
        tap(res => this.handleSuccessRegisteration(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeRegister())
      ).subscribe();
      this.subscriptions.push(registerSubscription);
    } else {
      this.publicService.validateAllFormFields(this.registerationForm);
    }
  }
  private finalizeRegister(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  private excuteDataForm(): any {
    let data: any = {
      name: this.registerationForm?.value?.name,
      phone: this.registerationForm?.value?.phone,
      iqama_No: this.registerationForm?.value?.nationalIdentify,
      email: this.registerationForm?.value?.email,
      type: 'parent',
      source_register: 'web',
      type_coming_otp: 'email',
      password: '123456'
    };
    return data;
  }
  private handleSuccessRegisteration(res: any): void {
    if (res.success) {
      this.authService.saveToken(res.token);
      this.router.navigate(['/Dashboard']);
    } else {
      this.handleError(res.error.message || 'An error occurred during registration.');
    }
  }
  // End Register Functions

  back(): void {
    this.location.back();
  }

  /* --- Handle api requests error messages --- */
  private handleError(error: any): any {
    this.setErrorMessage(error);
  }
  private setErrorMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
