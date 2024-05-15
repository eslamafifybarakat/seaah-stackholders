import { AlertsService } from './../../../services/generic/alerts.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { PublicService } from './../../../services/generic/public.service';
import { LogoutApiResponse, UserData } from 'src/app/interfaces/auth';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { keys } from '../../configs/localstorage-key';
import { TranslateModule } from '@ngx-translate/core';
import { userInfoMenu } from './user-info-menu-list';
import { ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';
interface MenuItem {
  id?: string;
  text: string;
  icon: string;
  routerLink?: string;
}
@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  private subscriptions: Subscription[] = [];

  currentLanguage: string;
  userInfoList: MenuItem[] = userInfoMenu;
  currentUserInformation: any | null;

  constructor(
    private confirmationService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo(): void {
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
  }
  logOut(): void {
    this.confirmationService?.confirm({
      message: this.publicService.translateTextFromJson('general.areYouSureToLogout'),
      header: this.publicService.translateTextFromJson('general.logout'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.logout();
      }
    });
  }
  logout(): void {
    this.publicService.showGlobalLoader.next(true);
    let logoutSubscription: Subscription = this.authService?.logout()?.pipe(
      // tap((res: LogoutApiResponse) => this.processLogoutResponse(res)),
      tap((res: any) => this.processLogoutResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
      })
    ).subscribe();
    this.subscriptions.push(logoutSubscription);
  }
  // private processLogoutResponse(res: LogoutApiResponse): void {
  private processLogoutResponse(res: any): void {
    if (res.status === 200) {
      this.authService.signOut();
      this.handleSuccess(res.message);
    } else {
      this.handleError(res?.message);
    }
  }

   /* --- Handle api requests messages --- */
   private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'),'success');
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'),'error');
  }
  private setMessage(message: string,type?:string): void {
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
