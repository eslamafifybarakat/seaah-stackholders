import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, tap } from 'rxjs';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { InstallmentRequestsService } from '../../../services/installment_requests.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PublicService } from 'src/app/services/generic/public.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-expense-details',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent {
  private subscriptions: Subscription[] = [];

  expenseId: number | string;
  clientId: number | string;
  isLoadingExpenseDetails: boolean = false;
  expenseDetails: any;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentRequestsService: InstallmentRequestsService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
    public publicService: PublicService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.loadPageData();
  }
  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.activatedRoute.params.subscribe((params) => {
      this.expenseId = params['id'];
      if (this.expenseId) {
        this.getExpenseById(this.expenseId);
        // this.fullPageUrl = environment.publicUrl + this.localizationLanguageService.getFullURL();
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل المصروف',
      description: 'تفاصيل المصروف',
      // image: 'https://ik.imagekit.io/2cvha6t2l9/Carousel%20card.svg?updatedAt=1713227892043'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start Get Record By Client Id
  getExpenseById(expenseId: number | string, preventLoading?: boolean): void {
    preventLoading ? '' : this.isLoadingExpenseDetails = true;
    let subscribeGetExpenseDetaiks: Subscription = this.installmentRequestsService?.getSingleExpense(expenseId).pipe(
      tap(res => this.handleGetExpenseSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeGetExpenseDetaiks);
  }
  private handleGetExpenseSuccess(response: any): void {
    if (response?.status == 200 || response?.status == 201) {
      this.expenseDetails = response.data;
      this.isLoadingExpenseDetails = false;
    } else {
      this.handleError(response?.message);
    }
  }
  // End Get Record By Client Id

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: any): any {
    // this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: any): any {
    this.isLoadingExpenseDetails = false;
    // this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type: string): void {
    // this.alertsService.openToast(type, type, message);
    // this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
