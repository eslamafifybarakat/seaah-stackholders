import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PublicService } from 'src/app/services/generic/public.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-expenses-modal',
  standalone: true,
  imports: [
     // Modules
     TranslateModule,
     CommonModule
  ],
  templateUrl: './show-expenses-modal.component.html',
  styleUrls: ['./show-expenses-modal.component.scss']
})
export class ShowExpensesModalComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  KidData: any;
  currentUserInformation: any | null;

  constructor(
    private alertsService:AlertsService,
    private publicService:PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.KidData = this.config?.data?.event;
  }
  

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
