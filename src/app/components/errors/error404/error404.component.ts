// Modules
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
// Components
// import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
// Services

@Component({
  selector: 'error404',
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    RouterModule,
    // Components
    // LanguageSelectorComponent
  ],
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component {

  constructor(
    private localizationLanguageService: LocalizationLanguageService
  ) {
    // localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
  }
}
