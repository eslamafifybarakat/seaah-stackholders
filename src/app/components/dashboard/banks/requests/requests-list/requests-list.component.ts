import { OrganizationsService } from './../../../services/organizations.service';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { DynamicTableLocalActionsComponent } from 'src/app/shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableV2Component } from 'src/app/shared/components/dynamic-table-v2/dynamic-table-v2.component';
import { DynamicTableComponent } from 'src/app/shared/components/dynamic-table/dynamic-table.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from 'src/app/shared/skeleton/skeleton/skeleton.component';
import { Subject, Subscription, catchError, debounceTime, finalize, tap } from 'rxjs';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { InstallmentRequestsService } from '../../../services/installment_requests.service';
import { ConfirmationService } from 'primeng/api';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { KidsService } from '../../../services/kids.service';
import { PayTuitionNowModalComponent } from '../../../parent/kids/pay-tuition-now-modal/pay-tuition-now-modal.component';
import { Router } from '@angular/router';
import { DeleteKidApiResponse } from 'src/app/interfaces/dashboard/kids';
import { EditRequestComponent } from '../edit-request/edit-request.component';
import { ChangeRequestStatusForExpenseComponent } from '../change-request-status-for-expense/change-request-status-for-expense.component';
import { RequestCardComponent } from '../request-card/request-card.component';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    PaginatorModule,
    CommonModule,
    FormsModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableV2Component,
    DynamicTableComponent,
    RequestCardComponent,
    DynamicSvgComponent,
    SkeletonComponent
  ],
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start My Requests List Variables
  isLoadingMyRequestsList: boolean = false;
  MyRequestsList: any[] = [];
  myRequestsCount: number = 0;
  tableHeaders: any = [];
  // End My Requests List Variables

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 10;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];
  @ViewChild('paginator') paginator: Paginator | undefined;
  // End Pagination Variables

  // Start Filtration Variables
  private searchSubject = new Subject<any>();

  filterCards: any = [];

  enableSortFilter: boolean = true;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};
  // End Filtration Variables

  // Start Permissions Variables
  showActionTableColumn: boolean = false;
  showEditAction: boolean = false;
  showToggleAction: boolean = false;
  showActionFiles: boolean = false;
  // End Permissions Variables
  currentLanguage: string;

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;


  // Statuses Variables
  statusesList: any = [];
  isLoadingStatuses: boolean = false;
  statusValue: string | number | null;
  // Statuses Variables
  filterForm = this.fb?.group(
    {
      status: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
    }
  );
  get formControls(): any {
    return this.filterForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentRequestsService: InstallmentRequestsService,
    private confirmationService: ConfirmationService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private kidsService: KidsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,

    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }
  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(500) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
  }
  private loadData(): void {
    this.getStatusList();
    this.tableHeaders = [
      {
        field: 'kidImage', header: '', title: '', type: 'img'
      },
      { field: 'kidName', header: 'dashboard.tableHeader.nameStudent', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.nameStudent'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'schoolName', header: 'dashboard.tableHeader.schoolName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.schoolName'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'parentName', header: 'dashboard.tableHeader.parentName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.parentName'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'status', header: 'dashboard.tableHeader.paidStatus', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidStatus'), type: 'status', sort: false, showDefaultSort: false, showAscSort: false, showDesSort: false, filter: false }
    ];
    this.updateMetaTagsForSEO();
    this.getAllMyRequestsList();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الطلبات | سعة',
      description: 'الطلبات | سعة',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Logo.jpeg?updatedAt=1712577283111'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  //Check if Filteration
  ifFilteration(): boolean {
    if (this.hasValue(this.searchKeyword) || this.isArrayNotEmpty(this.filtersArray) || this.isObjectNotEmpty(this.sortObj)) {
      return true;
    } else {
      return false
    }
  }
  // Function to check if a variable is not null or undefined
  hasValue<T>(variable: T | null | undefined): boolean {
    return variable !== null && variable !== undefined;
  }
  // Function to check if an array is not empty
  isArrayNotEmpty<T>(array: T[]): boolean {
    return this.hasValue(array) && array.length > 0;
  }
  // Function to check if an object has at least one key
  isObjectNotEmpty<T>(obj: T): boolean {
    return this.hasValue(obj) && Object.keys(obj).length > 0;
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    type == 'grid' ? this.perPage = 16 : this.perPage = 10;
    this.clearTable();
    this.dataStyleType = type;
  }

  // Start My Requests List Functions
  getAllMyRequestsList(isFiltering?: boolean): void {
    this.isSearch ? this.publicService.showGlobalLoader.next(true) : this.isLoadingMyRequestsList = true;
    let myRequestsSubscription: Subscription = this.installmentRequestsService?.getBankExpenseRequestsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.statusValue ?? null)
      .pipe(
        tap((res: any) => {
          this.processMyRequestsListResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeRequestsList())
      ).subscribe();
    this.subscriptions.push(myRequestsSubscription);
  }
  private processMyRequestsListResponse(response: any): void {
    if (response.status == 200 || response.status == 201) {
      this.myRequestsCount = response?.data?.total;
      this.pagesCount = Math.ceil(this.myRequestsCount / this.perPage);
      this.MyRequestsList = response?.data?.data;
      this.MyRequestsList?.forEach((item: any) => {
        item['kidImage'] = item?.kids?.image_path ?? null;
        item['kidName'] = item?.kids?.name ?? '--';

        item['parentId'] = item?.parents?.id ?? null;
        item['parentName'] = item?.kids?.name ?? '--';

        item['schoolId'] = item?.organizations?.id ?? null;
        let schoolNameObj: any = JSON.parse(item?.organizations?.name[this.currentLanguage] || '{}');
        item['schoolName'] = schoolNameObj[this.currentLanguage] ?? '--';
        let kidAddressObj: any = JSON.parse(item?.kids?.address || '{}');
        item['kidAddress'] = `${kidAddressObj?.region ?? ''}, ${kidAddressObj?.city ?? ''}, ${kidAddressObj?.street ?? ''}, ${kidAddressObj?.zip ?? ''}`;

        item['bankId'] = item?.banks?.id ?? null;
        let bankNameObj: any = JSON.parse(item?.banks?.name[this.currentLanguage] || '{}');
        item['bankName'] = bankNameObj[this.currentLanguage] ?? '--';

        item['status'] = item?.status;
        // item['active'] = false;
        if (item['status'] !== 'Approved') {
          item['active'] = false;
        }
      });
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeRequestsList(): void {
    this.isLoadingMyRequestsList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End My Requests List Functions

  // Start Show Details Modal
  changeStatus(item: any): void {
    const ref: any = this.dialogService?.open(ChangeRequestStatusForExpenseComponent, {
      data: {
        status: this.returnStatusActions(item?.status),
        item: item
      },
      header: this.publicService?.translateTextFromJson('general.changeStatus'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getAllMyRequestsList();
      }
    });
  }
  // End Show Details Modal

  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Bank/Requests/Details/' + item.id]);
  }
  // Add Edit Kid
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(EditRequestComponent, {
      data: item,
      header: this.publicService?.translateTextFromJson('dashboard.tuitionExpenses.editExpense'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.myRequestsCount == 0) {
          this.getAllMyRequestsList();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllMyRequestsList() : '';
        }
      }
    });
  }

  //Start Delete Kid Functions
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }
    this.publicService.showGlobalLoader.next(true);
    let deleteKidSubscription: Subscription = this.kidsService?.deleteKidById(item?.item?.id)?.pipe(
      tap((res: DeleteKidApiResponse) => this.processDeleteResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(deleteKidSubscription);
  }
  private processDeleteResponse(res: DeleteKidApiResponse): void {
    if (res.status === 200) {
      this.getAllMyRequestsList();
      this.handleSuccess(res.message);
    } else {
      this.handleError(res.message);
    }
  }
  //End Delete Kid Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 10;
    this.searchKeyword = keyWord;
    this.isSearch = true;
    this.isLoadingMyRequestsList = true;
    this.getAllMyRequestsList(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.isSearch = false;
    this.getAllMyRequestsList(true);
  }
  // End Search Functions

  // Filter Users Modal Function
  filterItemModal(): void {
    // const ref = this.dialogService?.open(FilterKidsComponent, {
    //   header: this.publicService?.translateTextFromJson('general.filter'),
    //   dismissableMask: false,
    //   width: '45%',
    //   data: this.filterCards,
    //   styleClass: 'custom-modal',
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res) {
    //     this.page = 1;
    //     this.filtersArray = res.conditions;
    //     this.filterCards = res.conditions;
    //     this.getAllMyRequestsList(true);
    //   }
    // });
  }
  // filter Table Functions
  filterItemsTable(event: any): void {
    this.filtersArray = [];
    Object.keys(event)?.forEach((key: any) => {
      this.tableHeaders?.forEach((colHeader: any) => {
        if (colHeader?.field == key) {
          event[key]?.forEach((record: any) => {
            record['type'] = colHeader?.type;
          });
        }
      });
    });
    Object.keys(event).forEach((key: any) => {
      event[key]?.forEach((record: any) => {
        if (record['type'] && record['value'] !== null) {
          let filterData;
          if (record['type'] == 'text' || record['type'] == 'date' || record['type'] == 'numeric' || record['type'] == 'status') {
            let data: any;
            if (record['type'] == 'date') {
              data = new Date(record?.value?.setDate(record?.value?.getDate() + 1));
              record.value = new Date(record?.value?.setDate(record?.value?.getDate() - 1));
            } else {
              data = record?.value;
            }

            filterData = {
              column: key,
              type: record?.type,
              data: data,
              operator: record?.matchMode
            }
          }

          else if (record['type'] == 'filterArray') {
            let arr: any = [];
            record?.value?.forEach((el: any) => {
              arr?.push(el?.id || el?.value);
            });
            if (arr?.length > 0) {
              filterData = {
                column: key,
                type: 'relation',
                data: arr
              }
            }
          }
          else if (record['type'] == 'boolean') {
            filterData = {
              column: key,
              type: record?.type,
              data: record?.value
            }
          }
          if (filterData) {
            this.filtersArray?.push(filterData);
          }
        }
      });
    });
    this.page = 1;
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllMyRequestsList();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllMyRequestsList();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllMyRequestsList();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllMyRequestsList();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllMyRequestsList();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.myRequestsCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllMyRequestsList() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // End Pagination Functions

  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

  // Return Status List
  returnStatusActions(type?: any): any {
    if (type == 'Pending') {
      if (this.currentLanguage == 'ar') {
        this.statusesList = [
          { id: 1, value: 'Preview', name: "مراجعة" },
          { id: 2, value: 'Approved', name: "موافقة" },
          { id: 3, value: 'Rejected', name: "رفض" }
        ];
      } else {
        this.statusesList = [
          { id: 1, value: 'Preview', name: "Preview" },
          { id: 2, value: 'Approved', name: "Accept" },
          { id: 3, value: 'Rejected', name: "Reject" }
        ];
      }
    }
    if (type == 'Preview') {
      if (this.currentLanguage == 'ar') {
        this.statusesList = [
          // { id: 1, value: 'Preview', name: "مراجعة" },
          { id: 2, value: 'Approved', name: "موافقة" },
          { id: 3, value: 'Rejected', name: "رفض" }
        ];
      } else {
        this.statusesList = [
          // { id: 1, value: 'Preview', name: "Preview" },
          { id: 2, value: 'Approved', name: "Accept" },
          { id: 3, value: 'Rejected', name: "Reject" }
        ];
      }
    }
    return this.statusesList;
  }

  // Start Status List Functions
  getStatusList(type?: any): void {
    if (this.currentLanguage == 'ar') {
      this.statusesList = [
        { id: 0, name: "الكل" },
        { id: 1, name: "قيد الانتظار" },
        { id: 2, name: "مرفوض" },
        { id: 3, name: "موافق عليه" }
      ];
    } else {
      this.statusesList = [
        { id: 0, name: "All" },
        { id: 1, name: "Pending" },
        { id: 2, name: "Rejected" },
        { id: 3, name: "Approved" }
      ];
    }
    let patchStatus: any;
    patchStatus = this.statusesList[0];
    this.filterForm?.get('status').setValue(patchStatus);
    // this.isLoadingStatuses = true;
    // let statuesSubscription: Subscription = this.kidsService?.getAllStatusesList()
    //   .pipe(
    //     tap((res: any) => this.processStatusListResponse(res)),
    //     catchError(err => this.handleError(err)),
    //     finalize(() => this.finalizeStatusListLoading())
    //   ).subscribe();
    // this.subscriptions.push(statuesSubscription);
  }
  private processStatusListResponse(response: any): void {
    if (response) {
      // this.levels = response?.data?.items;
      // if (this.isEdit) {
      //   let patchLevel: any = [];
      //   this.levels.forEach((element: any) => {
      //     if (this.kidData.level.id == element.id) {
      //       patchLevel.push(element);
      //     }
      //   });
      //   this.kidForm.get('level').setValue(patchLevel);
      // }
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeStatusListLoading(): void {
    this.isLoadingStatuses = false;

  }
  onStatusSelected(event: any): void {
    this.page = 1;
    this.perPage = 10;
    if (event?.value && event?.value?.id !== '0' && event?.value?.id !== 0) {
      console.log(event?.value);
      this.statusValue = event?.value?.id;
    } else {
      this.statusValue = null;
      let patchStatus: any = this.statusesList[0];
      this.filterForm?.get('status').setValue(patchStatus);
    }
    this.getAllMyRequestsList();
  }
  // End Status List Functions

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
