import { PublicService } from 'src/app/services/generic/public.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, TableModule],
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  userData: any;
  banks: any = [];
  bankHeaders: any;
  parents: any = [];
  parentHeaders: any;
  schools: any = [];
  schoolHeaders: any;
  universities: any = [];
  universitiesHeaders: any;
  constructor(
    private publicService: PublicService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.bankHeaders = [
      { field: 'bankName', header: 'dashboard.statistics.bankName' },
      { field: 'users', header: 'dashboard.statistics.usersNumber' }
    ];
    this.banks = [
      { id: 1, bankName: 'bank1', users: 200 },
      { id: 1, bankName: 'bank1', users: 200 },
      { id: 1, bankName: 'bank1', users: 200 },
      { id: 1, bankName: 'bank1', users: 200 },
      { id: 1, bankName: 'bank1', users: 200 },
      { id: 1, bankName: 'bank1', users: 200 },
      { id: 1, bankName: 'bank1', users: 200 },
    ];
    this.parentHeaders = [
      { field: 'name', header: 'dashboard.statistics.parentName' },
      { field: 'kidsNumber', header: 'dashboard.statistics.kidsNumber' },
      { field: 'schoolsNumber', header: 'dashboard.statistics.schoolsNumber' },
      { field: 'banksNumber', header: 'dashboard.statistics.banksNumber' }
    ];
    this.parents = [
      { name: 'Ahmed Ibrahim', kidsNumber: 3, schoolsNumber: 2, banksNumber: 1 },
      { name: 'Ahmed Ibrahim', kidsNumber: 3, schoolsNumber: 2, banksNumber: 1 },
      { name: 'Ahmed Ibrahim', kidsNumber: 3, schoolsNumber: 2, banksNumber: 1 },
      { name: 'Ahmed Ibrahim', kidsNumber: 3, schoolsNumber: 2, banksNumber: 1 },
      { name: 'Ahmed Ibrahim', kidsNumber: 3, schoolsNumber: 2, banksNumber: 1 },
      { name: 'Ahmed Ibrahim', kidsNumber: 3, schoolsNumber: 2, banksNumber: 1 },
    ];
    this.schoolHeaders = [
      { field: 'name', header: 'dashboard.statistics.parentName' },
      { field: 'parentNumber', header: 'dashboard.statistics.parentNumber' },
      { field: 'kidsNumber', header: 'dashboard.statistics.kidsNumber' }
    ];
    this.schools = [
      { name: 'Kareem Ali', parentNumber: 2, kidsNumber: 4 },
      { name: 'Kareem Ali', parentNumber: 2, kidsNumber: 4 },
      { name: 'Kareem Ali', parentNumber: 2, kidsNumber: 4 },
      { name: 'Kareem Ali', parentNumber: 2, kidsNumber: 4 },
    ]
    this.universitiesHeaders = [
      { field: 'name', header: 'dashboard.statistics.universityName' },
      { field: 'parentNumber', header: 'dashboard.statistics.parentNumber' },
      { field: 'kidsNumber', header: 'dashboard.statistics.kidsNumber' }
    ];
    this.universities = [
      { name: 'marwan Ali', parentNumber: 2, kidsNumber: 4 },
      { name: 'marwan Ali', parentNumber: 2, kidsNumber: 4 },
      { name: 'marwan Ali', parentNumber: 2, kidsNumber: 4 },
      { name: 'marwan Ali', parentNumber: 2, kidsNumber: 4 },
    ]
  }
  getUserData(): void {
    this.userData = this.authService.getUserLoginDataLocally();
  }
}
