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
import { AddEditKidComponent } from '../add-edit-kid/add-edit-kid.component';
import { KidCardComponent } from '../kid-card/kid-card.component';

//Services
import { LocalizationLanguageService } from '../../../../../services/generic/localization-language.service';
import { KidListingItem, KidsListApiResponse } from './../../../../../interfaces/dashboard/kids';
import { MetaDetails, MetadataService } from '../../../../../services/generic/metadata.service';
import { DeleteKidApiResponse } from '../../../../../interfaces/dashboard/kids';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { KidsService } from '../../../services/kids.service';
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
    DynamicTableV2Component,
    DynamicTableComponent,
    DynamicSvgComponent,
    KidCardComponent,
    SkeletonComponent,
  ],
  selector: 'app-kids-list',
  templateUrl: './kids-list.component.html',
  styleUrls: ['./kids-list.component.scss']
})
export class KidsListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Kids List Variables
  isLoadingKidsList: boolean = false;
  // kidsList: KidListingItem[] = [];
  kidsList: any[] = [];
  kidsCount: number = 0;
  tableHeaders: any = [];
  // End Kids List Variables

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
  currentLanguage :string ;

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private kidsService: KidsService,
    private cdr: ChangeDetectorRef,
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
        field: 'image_path', header: '', title: '', type: 'img'
      },
      // { field: 'status', header: 'dashboard.tableHeader.status', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.status'), type: 'status', sort: false, showDefaultSort: false, showAscSort: false, showDesSort: false, filter: false, },
      { field: 'code', header: 'dashboard.tableHeader.code', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.code'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'schoolName', header: 'dashboard.tableHeader.schoolName', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.schoolName'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'name', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'level', header: 'dashboard.tableHeader.level', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.level'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'class', header: 'dashboard.tableHeader.class', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.class'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },
      { field: 'addressName', header: 'dashboard.tableHeader.address', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.address'), type: 'text', sort: true, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: true, },

    ];
    this.updateMetaTagsForSEO();
    this.getAllKids();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الأطفال',
      description: 'الأطفال',
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

  // Start Kids List Functions
  getAllKids(isFiltering?: boolean): void {
    isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingKidsList = true;
    let kidsSubscription: Subscription = this.kidsService?.getKidsList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null)
      .pipe(
        tap((res: KidsListApiResponse) => {
           this.processKidsListResponse(res) ;
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeKidListLoading())
      ).subscribe();
    this.subscriptions.push(kidsSubscription);
  }
  private processKidsListResponse(response: KidsListApiResponse): void {
    if (response.status == 200) {
      this.kidsCount = response?.data?.total;
      this.pagesCount = Math.ceil(this.kidsCount / this.perPage);
      this.kidsList = response?.data?.items;
      console.log(this.kidsList);
      this.kidsList?.forEach((item:any)=>{
        item['addressName'] = `${item?.address?.city } , ${item?.address?.street} ` ;
        let name:any =JSON.parse(item?.school?.name[this.currentLanguage]||'{}') ;
        item['schoolName'] =name[this.currentLanguage] ;
        // item['school_name'] = "default school"
      })
 
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeKidListLoading(): void {
    this.isLoadingKidsList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showSearchLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Kids List Functions

  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
  }
  // Add Edit Kid
  addEditItem(item?: any, type?: any): void {
    console.log("item = ",item);
    
    const ref = this.dialogService?.open(AddEditKidComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.kids.editKid') : this.publicService?.translateTextFromJson('dashboard.kids.addKid'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.kidsCount == 0) {
          this.getAllKids();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllKids() : '';
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
      this.getAllKids();
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
    this.isLoadingKidsList = true;
    this.getAllKids(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllKids(true);
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
    //     this.getAllKids(true);
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
    this.getAllKids();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllKids();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllKids();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllKids();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllKids();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.kidsCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllKids() : '';
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
