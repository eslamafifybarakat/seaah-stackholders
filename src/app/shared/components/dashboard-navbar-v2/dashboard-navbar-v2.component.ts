// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AsideMenuV2Component } from '../aside-menu-v2/aside-menu-v2.component';
import { UserInfoComponent } from '../user-info/user-info.component';

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
    UserInfoComponent,
    AsideMenuV2Component,
  ],
  selector: 'dashboard-navbar-v2',
  templateUrl: './dashboard-navbar-v2.component.html',
  styleUrls: ['./dashboard-navbar-v2.component.scss']
})
export class DashboardNavbarV2Component {
  showSidebar: boolean = false;

  openSidebar(): void {
    this.showSidebar = true;
  }
}
