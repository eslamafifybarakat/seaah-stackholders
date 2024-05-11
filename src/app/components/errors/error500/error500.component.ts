import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
// Components
// import { LanguageSelectorComponent } from 'src/app/modules/shared/components/header/components/language-selector/language-selector.component';
// Services
//Pipes

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    RouterModule,
    // Components
    // LanguageSelectorComponent,
    //Pipes
    // LocalizeNumberPipe
  ],
  selector: 'error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component {

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private _location: Location
  ) {
    // localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
  }

  reload(): void {
    this.back();
    // window.location.reload();
  }
  back(): void {
    this._location.back();
  }
}
