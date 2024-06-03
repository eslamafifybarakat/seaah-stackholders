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
import { Router } from '@angular/router';
import { DeleteKidApiResponse } from 'src/app/interfaces/dashboard/kids';
import { KidCardComponent } from '../kid-card/kid-card.component';


@Component({
  selector: 'app-expenses-list',
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
    DynamicSvgComponent,
    SkeletonComponent,
    KidCardComponent,
  ],
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start My Expenses List Variables
  isLoadingExpensesList: boolean = false;
  MyExpensesList: any[] = [];
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

  statusValue: string | null = null;

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;

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
    this.tableHeaders = [
      {
        field: 'kidImage', header: '', title: '', type: 'img'
      },
      { field: 'kidName', header: 'dashboard.tableHeader.nameStudent', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.nameStudent'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'bankName', header: 'dashboard.tableHeader.bankName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.bankName'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'parentName', header: 'dashboard.tableHeader.parentName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.parentName'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'status', header: 'dashboard.tableHeader.paidStatus', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.paidStatus'), type: 'status', sort: false, showDefaultSort: false, showAscSort: false, showDesSort: false, filter: false }
    ];
    this.updateMetaTagsForSEO();
    this.getAllMyExpensesList();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'المصروفات | سعة',
      description: 'المصروفات | سعة',
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
  getAllMyExpensesList(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showGlobalLoader.next(true) : this.isLoadingExpensesList = true;
    let myRequestsSubscription: Subscription = this.installmentRequestsService?.getBankExpenseRequestsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.statusValue ?? null)
      .pipe(
        tap((res: any) => {
          this.processMyExpensesListResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeRequestsList())
      ).subscribe();
    this.subscriptions.push(myRequestsSubscription);
  }
  private processMyExpensesListResponse(response: any): void {
    if (response.status == 200 || response.status == 201) {
      this.myExpensesCount = response?.data?.total;
      this.pagesCount = Math.ceil(this.myExpensesCount / this.perPage);
      this.MyExpensesList = response?.data?.data;
      this.MyExpensesList?.forEach((item: any) => {
        item['kidImage'] = item?.kids?.image_path ?? null;
        item['kidName'] = item?.kids?.name ?? '--';

        item['parentId'] = item?.parents?.id ?? null;
        item['parentName'] = item?.kids?.name ?? '--';

        item['schoolId'] = item?.kids?.schools?.id ?? null;
        let schoolNameObj: any = JSON.parse(item?.kids?.schools?.name[this.currentLanguage] || '{}');
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
    this.isLoadingExpensesList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End My Expenses List Functions

  itemDetails(item?: any): void {
    this.router.navigate(['/Dashboard/Schools/Expenses/Details/' + item.id]);
  }
  // Add Edit Kid
  addEditItem(item?: any, type?: any): void {
    // const ref = this.dialogService?.open(EditRequestComponent, {
    //   data: item,
    //   header: this.publicService?.translateTextFromJson('dashboard.tuitionExpenses.editExpense'),
    //   dismissableMask: false,
    //   width: '60%',
    //   styleClass: 'custom-modal',
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res?.listChanged) {
    //     if (this.myExpensesCount == 0) {
    //       this.getAllMyExpensesList();
    //     } else {
    //       this.page = 1;
    //       this.publicService?.changePageSub?.next({ page: this.page });
    //       this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
    //       this.dataStyleType == 'grid' ? this.getAllMyExpensesList() : '';
    //     }
    //   }
    // });
  }

  //Start Delete Expenses Functions
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
      this.getAllMyExpensesList();
      this.handleSuccess(res.message);
    } else {
      this.handleError(res.message);
    }
  }
  //End Delete Expenses Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 10;
    this.searchKeyword = keyWord;
    this.isLoadingExpensesList = true;
    this.getAllMyExpensesList(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllMyExpensesList(true);
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
    //     this.getAllMyExpensesList(true);
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
    this.getAllMyExpensesList();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllMyExpensesList();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllMyExpensesList();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllMyExpensesList();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllMyExpensesList();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.myExpensesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllMyExpensesList() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // End Pagination Functions

  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
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
