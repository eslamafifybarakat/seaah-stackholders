import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExpensesModalComponent } from './show-expenses-modal.component';

describe('ShowExpensesModalComponent', () => {
  let component: ShowExpensesModalComponent;
  let fixture: ComponentFixture<ShowExpensesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShowExpensesModalComponent]
    });
    fixture = TestBed.createComponent(ShowExpensesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
