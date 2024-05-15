// Modules
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
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
    AsideMenuComponent,
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
