import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInstallmentWayComponent } from './add-edit-installment-way.component';

describe('AddEditInstallmentWayComponent', () => {
  let component: AddEditInstallmentWayComponent;
  let fixture: ComponentFixture<AddEditInstallmentWayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditInstallmentWayComponent]
    });
    fixture = TestBed.createComponent(AddEditInstallmentWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
