import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExpensesListComponent } from './my-expenses-list.component';

describe('MyExpensesListComponent', () => {
  let component: MyExpensesListComponent;
  let fixture: ComponentFixture<MyExpensesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyExpensesListComponent]
    });
    fixture = TestBed.createComponent(MyExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
