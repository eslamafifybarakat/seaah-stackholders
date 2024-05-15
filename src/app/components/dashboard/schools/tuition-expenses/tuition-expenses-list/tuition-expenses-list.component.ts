import { TuitionExpenseListingItem, TuitionExpensesListApiResponse } from './../../../../../interfaces/dashboard/tuitionExpenses';
// Modules
import { TranslateModule } from '@ngx-translate/core';
import { Paginator, PaginatorModule } from 'primeng/paginator';
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
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, map, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TuitionExpenseCardComponent } from '../tuition-expense-card/tuition-expense-card.component';
import { AddEditTuitionExpensesComponent } from '../add-edit-tuition-expense/add-edit-tuition-expense.component';
import { TuitionExpensesService } from '../../../services/tuitionExpenses.service';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    PaginatorModule,
    CommonModule,

    // Components
    DynamicTableLocalActionsComponent,
    TuitionExpenseCardComponent,
    DynamicTableV2Component,
    DynamicTableComponent,
    DynamicSvgComponent,
    SkeletonComponent,
  ],
  selector: 'app-tuition-expenses-list',
  templateUrl: './tuition-expenses-list.component.html',
  styleUrls: ['./tuition-expenses-list.component.scss']
})
export class TuitionExpensesListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Tuition Expenses List Variables
  isLoadingTuitionExpensesList: boolean = false;
  tuitionExpensesList: TuitionExpenseListingItem[] = [];
  tuitionExpensesCount: number = 0;
  tableHeaders: any = [];
  // End Tuition Expenses List Variables

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 5;
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
  schoolId: string | number | null = 1;
  currentLanguage: string | null;
  currentUserInformation: any | null;

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private tuitionExpensesService: TuitionExpensesService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(700) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
    this.schoolId = this.currentUserInformation?.id;
  }
  private loadData(): void {
    this.tableHeaders = [
      { field: 'titleName', header: 'dashboard.tableHeader.title', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.title'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'detailsName', header: 'dashboard.tableHeader.details', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.details'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'level', header: 'dashboard.tableHeader.level', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.level'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'total', header: 'dashboard.tableHeader.total', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.total'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'deserved_date', header: 'dashboard.tableHeader.deservedDate', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.deservedDate'), type: 'date', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
    ];
    this.updateMetaTagsForSEO();
    this.getAllTuitionExpenses();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'مصاريف التعليم',
      description: 'مصاريف التعليم',
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
    type == 'grid' ? this.perPage = 8 : this.perPage = 5;
    this.clearTable();
    this.dataStyleType = type;
  }

  // Start Tuition Expenses List Functions
  getAllTuitionExpenses(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingTuitionExpensesList = true;
    let tuitionSubscription: Subscription = this.tuitionExpensesService?.getTuitionExpensesList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.schoolId ?? null)
      .pipe(
        tap((res: any) => this.processTuitionExpensesListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeTuitionExpenseListLoading())
      ).subscribe();
    this.subscriptions.push(tuitionSubscription);

  }
  private processTuitionExpensesListResponse(response: any): void {
    if (response.status == 200) {
      this.tuitionExpensesCount = response?.data?.total;
      this.pagesCount = Math.ceil(this.tuitionExpensesCount / this.perPage);
      this.tuitionExpensesList = response?.data?.items;
      this.tuitionExpensesList?.forEach((item: any) => {
        item['title'] = { "en": "{\"ar\":\"إسلام\",\"en\":\"Eslam\"}" };
        let titleItem: any = JSON.parse(item?.title[this.currentLanguage] || '{}');
        item['titleName'] = titleItem[this.currentLanguage];
        item['titleAR'] = titleItem['ar'];
        item['titleEN'] = titleItem['en'];
        item['details'] = { "en": "{\"ar\":\"إسلام\",\"en\":\"Eslam\"}" };
        let detailsItem: any = JSON.parse(item?.details[this.currentLanguage] || '{}');
        item['detailsName'] = detailsItem[this.currentLanguage];
        item['detailsAR'] = titleItem['ar'];
        item['detailsEN'] = titleItem['en'];
      });
      console.log(this.tuitionExpensesList);
    } else {
      this.handleError(response.error);
      return;
    }
  }
  private finalizeTuitionExpenseListLoading(): void {
    this.isLoadingTuitionExpensesList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Tuition Expenses List Functions

  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
  }
  // Add Edit Tuition Expense
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditTuitionExpensesComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.tuitionExpenses.editExpense') : this.publicService?.translateTextFromJson('dashboard.tuitionExpenses.addExpense'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.tuitionExpensesCount == 0) {
          this.getAllTuitionExpenses();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllTuitionExpenses() : '';
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
    let deleteTuitionSubscription: Subscription = this.tuitionExpensesService?.deleteTuitionExpenseById(item?.item?.id)?.pipe(
      tap((res: any) => this.processDeleteResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(deleteTuitionSubscription);


  }
  private processDeleteResponse(res: any): void {
    if (res.status === 200) {
      this.getAllTuitionExpenses();
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
    this.perPage = 20;
    this.searchKeyword = keyWord;
    this.isLoadingTuitionExpensesList = true;
    this.getAllTuitionExpenses(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllTuitionExpenses(true);
  }
  // End Search Functions

  // Filter Users Modal Function
  filterItemModal(): void {
    // const ref = this.dialogService?.open(FilterClientsComponent, {
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
    //     this.getAllTuitionExpenses(true);
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
    this.getAllTuitionExpenses();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllTuitionExpenses();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllTuitionExpenses();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllTuitionExpenses();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllTuitionExpenses();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.tuitionExpensesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllTuitionExpenses() : '';
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
