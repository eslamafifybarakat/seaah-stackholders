import { LanguageSelectorComponent } from './../../../shared/components/language-selector/language-selector.component';
import { AuthService } from './../../../services/authentication/auth.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from './../../../services/generic/public.service';
import { AlertsService } from './../../../services/generic/alerts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountdownComponent } from '../countdown/countdown.component';
import { LoginApiResponse } from './../../../interfaces/auth';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize } from 'rxjs/operators';
import { CodeInputModule } from 'angular-code-input';
import { Subscription, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, CountdownComponent, CodeInputModule],
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent {
  private subscriptions: Subscription[] = [];

  email: string | null = '';
  time: any = Date.now() + ((60 * 1000) * 1);
  isLoadingAction: boolean = false;
  isLoadingBtn: boolean = false;
  isLoading: boolean = false;
  isWaiting: boolean = false;
  codeLength: any;
  urlData: any;
  minute: any;
  data: any;

  constructor(
    private authUserService: AuthService,
    private activateRoute: ActivatedRoute,
    private alertsService: AlertsService,
    private publicService: PublicService,
    private config: DynamicDialogConfig,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    private _location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.minute = this.time;
    this.data = this.config.data;
    console.log(this.data);

  }

  back(): void {
    this._location.back();
  }

  onCodeChanged(code: string): void {
    this.codeLength = code;
  }
  onCodeCompleted(code: string): void {
    this.codeLength = code;
  }
  printTimeEnd(event: any): void {
    if (event?.end) {
      this.isWaiting = true;
    }
  }

  // resendCode(activeLoading?: boolean): void {
  //   this.handleResendCodeResponse({ success: true });
  //   // if (activeLoading === true) {
  //   //   this.isLoadingAction = true;
  //   // }
  //   // const data = {
  //   //   emailAddress: this.email
  //   // };
  //   // this.authUserService?.forgetPassword(data)?.subscribe(
  //   //   (res: any) => {
  //   //     this.handleResendCodeResponse(res);
  //   //   },
  //   //   (err: any) => {
  //   //     this.handleError(err);
  //   //   }
  //   // );

  //   // this.cdr.detectChanges();
  // }
  private handleResendCodeResponse(res: any): void {
    this.isLoadingBtn = false;
    this.publicService.showGlobalLoader.next(false);
    this.isLoadingAction = false;

    if (res?.success === true) {
      this.codeLength = null;
      this.isWaiting = true;
      this.minute = Date.now() + (60 * 1000);
      this.isWaiting = false;
    } else {
      res?.error?.message ? this.alertsService?.openToast('error', 'error', res?.error?.message || this.publicService.translateTextFromJson('general.errorOccur')) : '';
    }
  }

  // Start Login Functions
  resendCode(activeLoading?: boolean): void {
    this.publicService.showGlobalLoader.next(true);
    let formData = new FormData();
    formData.append('phone', this.data.data.phone);
    //Send Request to login
    let loginSubscription: Subscription = this.authService?.login(formData)?.pipe(
      tap((res: LoginApiResponse) => this.handleSuccessLoggedIn(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.publicService.showGlobalLoader.next(false))
    ).subscribe();
    this.subscriptions.push(loginSubscription);
  }

  private handleSuccessLoggedIn(res: LoginApiResponse): void {
    if (res?.status == 200) {
      this.handleSuccess(res?.message);
    } else {
      this.handleError(res?.message);
    }
  }
  // End Login Functions

  // Start Verify Code Functions
  verifyCode(): void {
    if (this.codeLength.length == 5) {
      this.publicService.showGlobalLoader.next(true);
      const data: any = this.excuteDataForm();
      //Send Request to login
      let verifyCodeSubscription: Subscription = this.authUserService?.validateCode(data)?.pipe(
        tap(res => this.handleSuccessVerifyCode(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeVerifyCode())
      ).subscribe();
      this.subscriptions.push(verifyCodeSubscription);
    }
  }
  private finalizeVerifyCode(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  private excuteDataForm(): any {
    let data: any = {
      code: this.codeLength,
      phone: this.config?.data?.data?.phone?.toString()
    };
    console.log(data);

    return data;
  }
  private handleSuccessVerifyCode(res: any): void {
    if (res.status == 200) {
      this.ref?.close({ listChanged: true, data: res?.data });
      this.handleSuccess(res.message);
    } else {
      this.handleError(res.error.message || 'An error occurred during registration.');
    }
  }
  // End Verify Code Functions

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
