import { SkeletonComponent } from './../../shared/skeleton/skeleton/skeleton.component';
import { ReviewsCarouselComponent } from './../../shared/carousels/reviews-carousel/reviews-carousel.component';
import { PublicService } from 'src/app/services/generic/public.service';
// Modules
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingModule } from 'primeng/rating';

//Services
import { LocalizationLanguageService } from './../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../services/generic/metadata.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

// Components
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from './event-card/event-card.component';
import { eventsAr, eventsEn, questionsAr, questionsEn, reviewsAr, reviewsEn } from './home';
import { HomeService } from '../dashboard/services/home.service';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    AccordionModule,
    RouterModule,
    RatingModule,
    CommonModule,
    FormsModule,

    // Components
    ReviewsCarouselComponent,
    EventCardComponent,
    SkeletonComponent
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string = '';

  translatedText: any = {};
  isLoadingHome: boolean = false;
  homeData: any;

  jobOpportunities: any = [
    { img: 'assets/images/home/persons/1.svg' },
    { img: 'assets/images/home/persons/2.svg' },
    { img: 'assets/images/home/persons/3.svg' },
    { img: 'assets/images/home/persons/4.svg' }
  ];
  rate: any = 4.5;

  questions: any = [];

  reviews: any = [];

  events: any = [];

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private homeService: HomeService
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.questions = this.currentLanguage == 'ar' ? questionsAr : questionsEn;
    this.reviews = this.currentLanguage == 'ar' ? reviewsAr : reviewsEn;
    // this.events = this.currentLanguage == 'ar' ? eventsAr : eventsEn;
    this.loadData();
    this.getHomeData();
  }
  private loadData(): void {
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الرئيسية',
      description: 'الرئيسية'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  /* --- Start Hero Section Functions --- */
  getHomeData(): void {
    this.isLoadingHome = true;
    let subscribeHome: Subscription = this.homeService?.getHomeData().pipe(
      tap(res => this.handleHomeSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.isLoadingHome = false)
    ).subscribe();
    this.subscriptions.push(subscribeHome);
  }
  private handleHomeSuccess(response: any): void {
    this.isLoadingHome = false;
    if (response?.status == 200) {
      this.homeData = response?.data;
      this.events = this.homeData?.blogs?.data;
      this.events.forEach((item: any) => {
        item['title'] = item.title[this.currentLanguage];
        item['description'] = item.description[this.currentLanguage];
      });
    } else {
      this.handleError(response?.message);
    }
  }

  /* --- End Hero Section Functions --- */

  /* --- Handle api requests error messages --- */
  private handleError(err: any): any {
    this.setErrorMessage(err || 'An error has occurred');
  }
  private setErrorMessage(message: string): void {
    // Implementation for displaying the error message, e.g., using a sweetalert
    console.log(message);
    // this.alertsService?.openSweetAlert('error', message);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
