// Modules
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from '../../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableV2Component } from '../../../../../shared/components/dynamic-table-v2/dynamic-table-v2.component';
import { DynamicSvgComponent } from '../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { DynamicTableComponent } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { SkeletonComponent } from '../../../../../shared/skeleton/skeleton/skeleton.component';


//Services
import { LocalizationLanguageService } from '../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeleteKidApiResponse } from '../../../../../interfaces/dashboard/kids';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { KidsService } from '../../../services/kids.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ShowExpensesModalComponent } from '../../kids/show-expenses-modal/show-expenses-modal.component';
import { AddEditKidComponent } from '../../kids/add-edit-kid/add-edit-kid.component';
import { PayMultiTuitionNowModalComponent } from '../pay-multi-tuition-now-modal/pay-multi-tuition-now-modal.component';
import { InstallmentRequestsService } from '../../../services/installment_requests.service';
import { PayTuitionNowModalComponent } from '../../kids/pay-tuition-now-modal/pay-tuition-now-modal.component';


@Component({
  selector: 'app-my-expenses-list',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    PaginatorModule,
    CommonModule,
    FormsModule,
    DynamicTableLocalActionsComponent,
    DynamicTableV2Component,
    DynamicTableComponent,
    DynamicSvgComponent,
    SkeletonComponent],
  templateUrl: './my-expenses-list.component.html',
  styleUrls: ['./my-expenses-list.component.scss']
})
export class MyExpensesListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start My Expenses List Variables
  isLoadingMyExpenseList: boolean = false;
  // MyExpenseList: KidListingItem[] = [];
  MyExpenseList: any[] = [];
  myExpensesCount: number = 0;
  tableHeaders: any = [];
  // End My Expenses List Variables

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
      { field: 'bankName', header: 'dashboard.tableHeader.bankName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.bankName'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'status', header: 'dashboard.tableHeader.paidStatus', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidStatus'), type: 'status', sort: false, showDefaultSort: false, showAscSort: false, showDesSort: false, filter: false }
    ];
    this.updateMetaTagsForSEO();
    this.getAllMyExpenseList();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'مصاريفي | سعة',
      description: 'مصاريفي | سعة',
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

  // Start My Expenses List Functions
  getAllMyExpenseList(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showGlobalLoader.next(true) : this.isLoadingMyExpenseList = true;
    let myExpensesSubscription: Subscription = this.installmentRequestsService?.getMyExpenseList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.statusValue ?? null)
      .pipe(
        tap((res: any) => {
          this.processMyExpenseListResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeKidListLoading())
      ).subscribe();
    this.subscriptions.push(myExpensesSubscription);
  }
  private processMyExpenseListResponse(response: any): void {
    if (response.status == 200) {
      this.myExpensesCount = response?.data?.total;
      this.pagesCount = Math.ceil(this.myExpensesCount / this.perPage);
      this.MyExpenseList = response?.data?.items?.data;
      this.MyExpenseList?.forEach((item: any) => {
        item['kidImage'] = item?.kids?.image_path;
        if (item?.person_pay_type == 'mykids') {
          item['kidName'] = item?.kids?.name;
        } else {
          item['kidName'] = this.currentLanguage == 'en' ? 'Me' : 'أنا';
        }

        item['parentId'] = item?.parents?.id;
        item['parentName'] = item?.kids?.name;

        item['schoolId'] = item?.kids?.schools?.id;
        let schoolNameObj: any = JSON.parse(item?.kids?.schools?.name[this.currentLanguage] || '{}');
        item['schoolName'] = schoolNameObj[this.currentLanguage];
        let kidAddressObj: any = JSON.parse(item?.kids?.address || '{}');
        item['kidAddress'] = `${kidAddressObj?.region ?? ''}, ${kidAddressObj?.city ?? ''}, ${kidAddressObj?.street ?? ''}, ${kidAddressObj?.zip ?? ''}`;

        item['bankId'] = item?.banks?.id;
        let bankNameObj: any = JSON.parse(item?.banks?.name[this.currentLanguage] || '{}');
        item['bankName'] = bankNameObj[this.currentLanguage];

        item['status'] = item?.status;
        item['status'] = 'Previewed';
        if (item['status'] == 'Approved') {
          item['active'] = false;
        }
        if (item?.id == 3) {
          item['status'] = 'Approved';
          item['active'] = false;
        }
      });
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeKidListLoading(): void {
    this.isLoadingMyExpenseList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End My Expenses List Functions

  // Start Show Details Modal
  showExpensesDetails(event: any): void {
    console.log(event);
    const ref: any = this.dialogService?.open(PayTuitionNowModalComponent, {
      data: {
        event
      },
      header: this.publicService?.translateTextFromJson('general.expenses'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getAllMyExpenseList();
      }
    });
  }
  // End Show Details Modal

  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Kids/Details/' + item.id]);
  }
  // Add Edit Kid
  addEditItem(item?: any, type?: any): void {
    console.log("item = ", item);
    item['kids']['installmentways'] = item?.installmentways;
    item['kids']['banks'] = item?.banks;
    const ref = this.dialogService?.open(PayTuitionNowModalComponent, {
      data: item?.kids,
      header: this.publicService?.translateTextFromJson('dashboard.tuitionExpenses.editExpense'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.myExpensesCount == 0) {
          this.getAllMyExpenseList();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllMyExpenseList() : '';
        }
      }
    });
  }
  // Add My Expense
  addMyExpense(item?: any, type?: any): void {
    const ref = this.dialogService?.open(PayMultiTuitionNowModalComponent, {
      data: item?.kids,
      header: this.publicService?.translateTextFromJson('dashboard.tuitionExpenses.addExpense'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.myExpensesCount == 0) {
          this.getAllMyExpenseList();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllMyExpenseList() : '';
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
      this.getAllMyExpenseList();
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
    this.isLoadingMyExpenseList = true;
    this.getAllMyExpenseList(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllMyExpenseList(true);
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
    //     this.getAllMyExpenseList(true);
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
    this.getAllMyExpenseList();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllMyExpenseList();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllMyExpenseList();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllMyExpenseList();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllMyExpenseList();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.myExpensesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllMyExpenseList() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // End Pagination Functions

  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

  // Start Status List Functions
  getStatusList(): void {
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
    this.getAllMyExpenseList();
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
