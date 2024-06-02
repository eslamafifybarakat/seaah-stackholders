import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { SkeletonComponent } from 'src/app/shared/skeleton/skeleton/skeleton.component';
import { keys } from './../../../../../shared/configs/localstorage-key';
import { KidsListApiResponse } from 'src/app/interfaces/dashboard/kids';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KidsService } from '../../../services/kids.service';
import { TranslateModule } from '@ngx-translate/core';
import { InstallmentRequestsService } from '../../../services/installment_requests.service';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, SkeletonComponent, RouterModule],
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string = '';

  kidId: any;
  kidDetails: any;
  isLoadingKidDetails: boolean = false;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentRequestsService: InstallmentRequestsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private alertsService: AlertsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.kidId = params['id'];
    });
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
    if (this.kidId) {
      this.getInstallmentRequestDetails();

    }
  }

  // Start Kids Details Functions
  getInstallmentRequestDetails(): void {
    this.isLoadingKidDetails = true;
    let kidsDetailsSubscription: Subscription = this.installmentRequestsService?.getInstallmentRequestById(this.kidId)
      .pipe(
        tap((res: KidsListApiResponse) => {
          this.processKidDetailsResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.isLoadingKidDetails = false)
      ).subscribe();
    this.subscriptions.push(kidsDetailsSubscription);
  }
  private processKidDetailsResponse(response: KidsListApiResponse): void {
    if (response.status == 200) {
      this.kidDetails = response.data;
      let organizationNameObj: any = JSON.parse(this.kidDetails.school?.name?.en[this.currentLanguage] || '{}');
      // this.kidDetails.school['name'] = organizationNameObj[this.currentLanguage];

      // this.kidDetails.school['location'] = this.kidDetails.school?.location[this.currentLanguage];
    } else {
      this.handleError(response.message);
      return;
    }
  }
  // End Kid Details Functions
  getName(name: any): any {
    return JSON.parse(name)
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

