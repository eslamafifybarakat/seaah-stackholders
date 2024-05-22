import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestStatusForExpenseComponent } from './change-request-status-for-expense.component';

describe('ChangeRequestStatusForExpenseComponent', () => {
  let component: ChangeRequestStatusForExpenseComponent;
  let fixture: ComponentFixture<ChangeRequestStatusForExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChangeRequestStatusForExpenseComponent]
    });
    fixture = TestBed.createComponent(ChangeRequestStatusForExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
