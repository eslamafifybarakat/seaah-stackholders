import { AlertsService } from './../../../services/generic/alerts.service';
// Modules
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

//Services
import { AsideMenuService } from './../../../components/dashboard/services/aside-menu.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { PublicService } from './../../../services/generic/public.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/api';

// Menu Interface
interface MenuItem {
  id?: string;
  text: string;
  icon: string;
  routerLink?: string;
  state: boolean;
  permission?: boolean;
  children?: MenuItem[];
}
@Component({
  standalone: true,
  imports: [
    ConfirmDialogModule,
    TranslateModule,
    TooltipModule,
    CommonModule,
    RouterModule,
  ],
  selector: 'aside-menu-v2',
  templateUrl: './aside-menu-v2.component.html',
  styleUrls: ['./aside-menu-v2.component.scss']
})
export class AsideMenuV2Component {
  private subscriptions: Subscription[] = [];

  collapsed: boolean = false;
  screenWidth: any = 0;
  showSideMenu: boolean = false;
  rotated: boolean = false;
  menuListItems: MenuItem[] = [];
  currentLanguage: string = 'en';
  url: string;

  @Input() showCollapseBtn: boolean = true;
  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();

  constructor(
    private confirmationService: ConfirmationService,
    private asideMenuService: AsideMenuService,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.url = this.router.url;

    this.getMenuItems();
    this.screenWidth = window?.innerWidth;
  }

  // Get menu items list
  getMenuItems(): void {
    this.menuListItems = this.asideMenuService.getParentAsideMenuItem();
  }

  // Handle click event on menu item
  handelClick(item: any): void {
    this.menuListItems.forEach((ele: any) => {
      ele.state = false;
    });
    item.state = !item?.state;
  }
  // Toggle sidebar collapse
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.rotate();
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  // Toggle sidebar icon
  toggleIcon(): void {
    this.collapsed = true;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  // Rotate sidebar arrow icon
  rotate(): void {
    this.rotated = !this.rotated;
  }

  // Logout User
  logout(): void {
    this.confirmationService?.confirm({
      message: this.publicService.translateTextFromJson('general.areYouSureToLogout'),
      header: this.publicService.translateTextFromJson('general.logout'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.logOut();
      }
    });
  }

  logOut(): void {
    this.publicService.showGlobalLoader.next(true);
    let logoutSubscription: Subscription = this.authService?.logout()?.pipe(
      tap((res: any) => this.processLogoutResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
      })
    ).subscribe();
    this.subscriptions.push(logoutSubscription);
  }
  private processLogoutResponse(res: any): void {
    const messageType = res ? 'success' : 'error';
    const message = res?.message || '';

    this.alertsService.openToast(messageType, messageType, message);
    if (messageType === 'success') {
      this.authService.signOut();
    }
  }

  /* --- Handle api requests error messages --- */
  private handleError(err: any): any {
    this.setErrorMessage(err || this.publicService.translateTextFromJson('general.errorOccur'));
  }
  private setErrorMessage(message: string): void {
    this.alertsService.openToast('error', 'error', message);
    this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
