import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionExpenseCardComponent } from './tuition-expense-card.component';

describe('TuitionExpenseCardComponent', () => {
  let component: TuitionExpenseCardComponent;
  let fixture: ComponentFixture<TuitionExpenseCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuitionExpenseCardComponent]
    });
    fixture = TestBed.createComponent(TuitionExpenseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
