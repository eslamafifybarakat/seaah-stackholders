import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionExpensesListComponent } from './tuition-expenses-list.component';

describe('TuitionExpensesListComponent', () => {
  let component: TuitionExpensesListComponent;
  let fixture: ComponentFixture<TuitionExpensesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuitionExpensesListComponent]
    });
    fixture = TestBed.createComponent(TuitionExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
