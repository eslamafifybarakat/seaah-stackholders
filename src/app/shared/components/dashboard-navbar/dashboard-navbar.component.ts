// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
// import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { AsideMenuV2Component } from '../aside-menu-v2/aside-menu-v2.component';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    RouterModule,
    SidebarModule,

    // Components
    LanguageSelectorComponent,
    AsideMenuV2Component,
    UserInfoComponent
  ],
  selector: 'dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent {
  showSidebar: boolean = false;
  currentUserInformation: any | null;

  openSidebar(): void {
    this.showSidebar = true;
  }


  constructor(
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.currentUserInformation = this.authService.getCurrentUserInformationLocally();
  }

}
