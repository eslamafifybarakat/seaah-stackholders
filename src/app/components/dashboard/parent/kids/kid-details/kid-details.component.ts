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

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, SkeletonComponent, RouterModule],
  selector: 'app-kid-details',
  templateUrl: './kid-details.component.html',
  styleUrls: ['./kid-details.component.scss']
})
export class KidDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string = '';

  kidId: any;
  kidDetails: any;
  isLoadingKidDetails: boolean = false;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private kidsService: KidsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.kidId = params['id'];
    });
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
    if (this.kidId) {
      this.getKidDetails();
    }
  }

  // Start Kids Details Functions
  getKidDetails(): void {
    this.isLoadingKidDetails = true;
    let kidsDetailsSubscription: Subscription = this.kidsService?.getKidById(this.kidId)
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
      let organizationNameObj: any = JSON.parse(this.kidDetails.school?.name?.[this.currentLanguage] || '{}');
      this.kidDetails.school['name'] = organizationNameObj[this.currentLanguage];

      this.kidDetails.school['location'] = this.kidDetails.school?.location[this.currentLanguage];
    } else {
      this.handleError(response.message);
      return;
    }
  }
  // End Kid Details Functions

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
