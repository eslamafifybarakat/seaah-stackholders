import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AlertsService } from './../../../../services/generic/alerts.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, catchError, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, SkeletonModule, ImageModule],
  selector: 'app-file-upload-from-server',
  templateUrl: './file-upload-from-server.component.html',
  styleUrls: ['./file-upload-from-server.component.scss']
})
export class FileUploadFromServerComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  @Input() showFile: boolean = false;
  @Input() isSupportAll: boolean = true;
  @Input() isEdit: boolean = false;
  @Input() showPreview: boolean = false;
  @Input() accept: string = 'image/*';
  @Input() imageSrc: string = '';
  @Input() supports: string = 'PNG, JPG, GIF up to 10MB';

  @Output() uploadHandler: EventEmitter<any> = new EventEmitter();

  dragging: boolean = false;
  loaded: boolean = false;
  isLoading: boolean = false;

  name: string = '';
  fileSize: any;
  type: string = '';

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
  ) { }

  ngOnInit(): void {
    if (this.isEdit) {
      this.showFile = true;
      this.name = this.imageSrc;
      this.type = this.imageSrc;
    }
  }

  handleInputChange(e: any): void {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.fileSize = this.formatSizeUnits(file?.size);
    this.name = file?.name;
    this.type = file?.type;
    this.uploadFile(file);
  }

  // Start Upload File
  uploadFile(file: any): void {
    this.isLoading = true;
    let formData = new FormData();
    formData.append('file', file);
    let subscribe: Subscription = this.publicService?.uploadFile(formData).pipe(
      tap(res => this.handleUploadFileSuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribe);
  }
  private handleUploadFileSuccess(response: any): void {
    if (response?.success || true) {
      this.handleSuccess(response?.message);
      this.handleUploadSuccess(response);
    } else {
      this.handleError(response?.message);
    }
  }
  private handleUploadSuccess(res: any) {
    this.imageSrc = res?.result?.fileName;
    this.uploadHandler?.emit({ file: res?.result?.fileName });
  }
  // End Upload File

  handleDragEnter(): void {
    this.dragging = true;
    this.showFile = true;
  }

  handleDragLeave(): void {
    this.dragging = false;
    this.showFile = false;
  }

  handleDrop(e: any): void {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
    this.showFile = true;
  }

  handleImageLoad(): void {
    this.showFile = true;
  }

  remove(): void {
    this.showFile = false;
  }

  formatSizeUnits(size: any): void {
    if (size >= 1073741824) { size = (size / 1073741824).toFixed(2) + " GB"; }
    else if (size >= 1048576) { size = (size / 1048576).toFixed(2) + " MB"; }
    else if (size >= 1024) { size = (size / 1024).toFixed(2) + " KB"; }
    else if (size > 1) { size = size + " bytes"; }
    else if (size == 1) { size = size + " byte"; }
    else { size = "0 bytes"; }
    return size;
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: any): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
    this.showFile = true;
  }
  private handleError(err: any): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
    this.showFile = false;
  }
  private setMessage(message: string, type: string): void {
    this.alertsService.openToast(type, type, message);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}



