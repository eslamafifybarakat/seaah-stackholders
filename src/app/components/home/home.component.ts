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
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string = '';

  translatedText: any = {};

  jobOpportunities: any = [
    { img: 'assets/images/home/persons/1.svg' },
    { img: 'assets/images/home/persons/2.svg' },
    { img: 'assets/images/home/persons/3.svg' },
    { img: 'assets/images/home/persons/4.svg' }
  ];
  rate: any = 4.5;

  questions: any = [
    {
      id: 1,
      title: "What services does TanahAir Offer?",
      description: "TanahAir offers a service for creating a website design, illustration, icon set, website development, animation and digital marketing."
    },
    {
      id: 2,
      title: "Why should i choose a Design studio like TanahAir over full-service agency?",
      description: "Because TanahAir provides the best service to customers and provides flexibility to solve problems with our experts so that customers get satisfaction. And we provide service very quickly according to the price we offer"
    },
    {
      id: 3,
      title: "How does TanahAir create website content without knowing our Business plan?",
      description: "TanahAir offers a service for creating a website design, illustration, icon set, website development, animation and digital marketing."
    },
    {
      id: 4,
      title: "What will be delivered? And When?",
      description: "TanahAir offers a service for creating a website design, illustration, icon set, website development, animation and digital marketing."
    },
    {
      id: 5,
      title: "What often will results be reported?",
      description: "TanahAir offers a service for creating a website design, illustration, icon set, website development, animation and digital marketing."
    },
    {
      id: 6,
      title: "How Quickly will i start seeing result after working with TanahAir?",
      description: "TanahAir offers a service for creating a website design, illustration, icon set, website development, animation and digital marketing."
    }
  ];

  reviews: any = [
    { id: 1, name: 'محمد طارق', position: 'طالب جامعي', description: 'خدمة سعة وفرت عليَ كثيراً ، فقد تمكنت من تقسيط  رسوم جامعتي بدون أي فوائد أو رسوم إضافية لذلك أشكركم كثيراً' },
    { id: 1, name: 'محمد طارق', position: 'طالب جامعي', description: 'خدمة سعة وفرت عليَ كثيراً ، فقد تمكنت من تقسيط  رسوم جامعتي بدون أي فوائد أو رسوم إضافية لذلك أشكركم كثيراً' },
    { id: 1, name: 'محمد طارق', position: 'طالب جامعي', description: 'خدمة سعة وفرت عليَ كثيراً ، فقد تمكنت من تقسيط  رسوم جامعتي بدون أي فوائد أو رسوم إضافية لذلك أشكركم كثيراً' },
    { id: 1, name: 'محمد طارق', position: 'طالب جامعي', description: 'خدمة سعة وفرت عليَ كثيراً ، فقد تمكنت من تقسيط  رسوم جامعتي بدون أي فوائد أو رسوم إضافية لذلك أشكركم كثيراً' }
  ];
  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private publicService: PublicService,
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.loadData();
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
