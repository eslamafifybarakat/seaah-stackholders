import { PublicService } from './../../../../services/generic/public.service';
import { ConfirmDeleteComponent } from './../../../../shared/components/confirm-delete/confirm-delete.component';
import { InstallmentWaysListingItem } from './../../../../interfaces/dashboard/installmentWays';
import { Component, Inject, Input, Output, PLATFORM_ID, EventEmitter } from '@angular/core';
import { keys } from '../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'installment-way-card',
  templateUrl: './installment-way-card.component.html',
  styleUrls: ['./installment-way-card.component.scss']
})
export class InstallmentWayCardComponent {
  @Input() item: InstallmentWaysListingItem;
  currentLanguage: string;

  @Output() editItemHandler: EventEmitter<any> = new EventEmitter();
  @Output() deleteItemHandler: EventEmitter<any> = new EventEmitter();
  @Output() enableConfirmedByShowInput: boolean = false;
  @Output() enableConfirmDeleteDialog: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private publicService: PublicService,
    private dialogService: DialogService
  ) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  editItem(item: any): void {
    this.editItemHandler.emit(item);
  }
  deleteItem(item: any): void {
    if (this.enableConfirmDeleteDialog) {
      const ref = this.dialogService.open(ConfirmDeleteComponent, {
        data: {
          name: item['name'],
          enableConfirm: this.enableConfirmedByShowInput,
        },
        header: this.publicService?.translateTextFromJson('general.confirm_delete'),
        dismissableMask: false,
        width: '35%'
      });

      ref.onClose.subscribe((res: any) => {
        if (res?.confirmed) {
          this.deleteItemHandler?.emit({ item: item, confirmed: res?.confirmed });
        }
      });
    } else {
      this.deleteItemHandler?.emit({ item: item, confirmed: true });
    }
  }
}
