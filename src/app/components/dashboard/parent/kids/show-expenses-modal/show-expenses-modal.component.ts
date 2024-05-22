import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { PayTuitionNowModalComponent } from '../pay-tuition-now-modal/pay-tuition-now-modal.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    CommonModule,

    DynamicSvgComponent,
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
    private alertsService: AlertsService,
    private publicService: PublicService,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.KidData = this.config?.data?.event;
    console.log("data come to list ex ", this.KidData);
    this.currentLanguage = this.publicService.getCurrentLanguage();
  }

  totalExpenses(): any {
    let total: any = 0;
    this.KidData?.expenses?.forEach((element: any) => {
      total = total + +element?.total;
    });
    return total;
  }
  // Start Pay Noe Modal
  payNow(event: any): void {
    console.log("data = ", event);
    this.cancel();
    const refPayNow: any = this.dialogService?.open(PayTuitionNowModalComponent, {
      data: this.KidData,
      header: this.publicService?.translateTextFromJson('general.payNow'),
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom-modal',
    });
    refPayNow?.onClose.subscribe((res: any) => {
      console.log(res);
      if (res?.listChanged) {

      }
    });
  }
  // End Pay Noe Modal

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
