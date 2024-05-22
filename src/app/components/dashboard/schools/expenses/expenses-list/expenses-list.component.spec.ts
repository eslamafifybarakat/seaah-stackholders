import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesListComponent } from './expenses-list.component';

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExpensesListComponent]
    });
    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
