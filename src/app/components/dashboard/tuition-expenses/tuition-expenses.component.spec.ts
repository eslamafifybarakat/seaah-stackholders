import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionExpensesComponent } from './tuition-expenses.component';

describe('TuitionExpensesComponent', () => {
  let component: TuitionExpensesComponent;
  let fixture: ComponentFixture<TuitionExpensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuitionExpensesComponent]
    });
    fixture = TestBed.createComponent(TuitionExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
