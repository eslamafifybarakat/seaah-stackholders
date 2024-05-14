import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTuitionExpensesComponent } from './add-edit-tuition-expense.component';

describe('AddEditTuitionExpensesComponent', () => {
  let component: AddEditTuitionExpensesComponent;
  let fixture: ComponentFixture<AddEditTuitionExpensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditTuitionExpensesComponent]
    });
    fixture = TestBed.createComponent(AddEditTuitionExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
