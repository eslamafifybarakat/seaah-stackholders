// Modules
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from '../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableV2Component } from '../../../../shared/components/dynamic-table-v2/dynamic-table-v2.component';
import { AddEditInstallmentWayComponent } from '../add-edit-installment-way/add-edit-installment-way.component';
import { FilterInstallmentWaysComponent } from '../filter-installment-ways/filter-installment-ways.component';
import { DynamicSvgComponent } from '../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { DynamicTableComponent } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { InstallmentWayCardComponent } from '../installment-way-card/installment-way-card.component';
import { SkeletonComponent } from '../../../../shared/skeleton/skeleton/skeleton.component';

//Services
import { InstallmentWaysListApiResponse, InstallmentWaysListingItem } from './../../../../interfaces/dashboard/installmentWays';
import { LocalizationLanguageService } from '../../../../services/generic/localization-language.service';
import { DeleteInstallmentWaySuccessResponse } from '../../../../interfaces/dashboard/installmentWays';
import { MetaDetails, MetadataService } from '../../../../services/generic/metadata.service';
import { InstallmentWaysService } from '../../services/installment-ways.service';
import { AlertsService } from '../../../../services/generic/alerts.service';
import { PublicService } from '../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    PaginatorModule,
    CommonModule,

    // Components
    DynamicTableLocalActionsComponent,
    InstallmentWayCardComponent,
    DynamicTableV2Component,
    DynamicTableComponent,
    DynamicSvgComponent,
    SkeletonComponent,
  ],
  selector: 'app-installment-ways-list',
  templateUrl: './installment-ways-list.component.html',
  styleUrls: ['./installment-ways-list.component.scss']
})
export class InstallmentWaysListComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string = '';

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Installment Ways List Variables
  isLoadingInstallmentWaysList: boolean = false;
  installmentWaysList: InstallmentWaysListingItem[] = [];
  installmentWaysCount: number = 0;
  tableHeaders: any = [];
  // End Installment Ways List Variables

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

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;


  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }
  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage()
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(700) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
  }
  private loadData(): void {
    this.tableHeaders = [
      { field: 'name', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'description', header: 'dashboard.tableHeader.description', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.description'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
    ];
    this.updateMetaTagsForSEO();
    this.getAllInstallmentWays();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'طرق التقسيط',
      description: 'طرق التقسيط',
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

  // Start Installment Ways List Functions
  getAllInstallmentWays(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showGlobalLoader.next(true) : this.isLoadingInstallmentWaysList = true;
    let insallmentWaysSubscription: Subscription = this.installmentWaysService?.getInstallmentWaysList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null)
      .pipe(
        tap((res: InstallmentWaysListApiResponse) => this.processInstallmentWaysListResponse(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeInstallmentWayList())
      ).subscribe();
    this.subscriptions.push(insallmentWaysSubscription);
  }
  private processInstallmentWaysListResponse(response: InstallmentWaysListApiResponse): void {
    if (response.status == 200) {
      this.installmentWaysCount = response?.data?.total;
      this.installmentWaysList = response.data.items;
      this.pagesCount = Math.ceil(this.installmentWaysCount / this.perPage);
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeInstallmentWayList(): void {
    this.isLoadingInstallmentWaysList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Installment Ways List Functions

  itemDetails(item?: any): void {
    // this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
  }
  // Add Edit Installment Way
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditInstallmentWayComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.installmentWays.editInstallmentWay') : this.publicService?.translateTextFromJson('dashboard.installmentWays.addInstallmentWay'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.installmentWaysCount == 0) {
          this.getAllInstallmentWays();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllInstallmentWays() : '';
        }
      }
    });
  }
  //Start Delete Installment Way Functions
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }
    this.publicService.showGlobalLoader.next(true);
    let deleteWaySubscription: Subscription = this.installmentWaysService?.deleteInstallmentWayById(item?.item?.id)?.pipe(
      tap((res: DeleteInstallmentWaySuccessResponse) => this.processDeleteResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(deleteWaySubscription);
  }
  private processDeleteResponse(res: any): void {
    if (res.status === 200) {
      this.handleSuccess(res.message);
    } else {
      this.handleError(res.message);
    }
  }
  //End Delete Installment Way Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 10;
    this.searchKeyword = keyWord;
    this.isLoadingInstallmentWaysList = true;
    this.getAllInstallmentWays(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllInstallmentWays(true);
  }
  // End Search Functions

  // Filter Installment Ways Modal Function
  filterItemModal(): void {
    const ref = this.dialogService?.open(FilterInstallmentWaysComponent, {
      header: this.publicService?.translateTextFromJson('general.filter'),
      dismissableMask: false,
      width: '45%',
      data: this.filterCards,
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res) {
        this.page = 1;
        this.filtersArray = res.conditions;
        this.filterCards = res.conditions;
        this.getAllInstallmentWays(true);
      }
    });
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
    this.getAllInstallmentWays();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllInstallmentWays();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllInstallmentWays();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllInstallmentWays();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllInstallmentWays();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.installmentWaysCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllInstallmentWays() : '';
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
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'));
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'));
  }
  private setMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
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
