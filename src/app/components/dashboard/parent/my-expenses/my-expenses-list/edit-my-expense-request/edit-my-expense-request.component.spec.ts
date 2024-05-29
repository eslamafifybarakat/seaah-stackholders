import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyExpenseRequestComponent } from './edit-my-expense-request.component';

describe('EditMyExpenseRequestComponent', () => {
  let component: EditMyExpenseRequestComponent;
  let fixture: ComponentFixture<EditMyExpenseRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMyExpenseRequestComponent]
    });
    fixture = TestBed.createComponent(EditMyExpenseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
