import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInstallmentWaysComponent } from './filter-installment-ways.component';

describe('FilterInstallmentWaysComponent', () => {
  let component: FilterInstallmentWaysComponent;
  let fixture: ComponentFixture<FilterInstallmentWaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterInstallmentWaysComponent]
    });
    fixture = TestBed.createComponent(FilterInstallmentWaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
