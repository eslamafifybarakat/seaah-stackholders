import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNavbarV2Component } from './dashboard-navbar-v2.component';

describe('DashboardNavbarV2Component', () => {
  let component: DashboardNavbarV2Component;
  let fixture: ComponentFixture<DashboardNavbarV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardNavbarV2Component]
    });
    fixture = TestBed.createComponent(DashboardNavbarV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
