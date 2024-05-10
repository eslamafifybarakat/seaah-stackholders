import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentWayCardComponent } from './installment-way-card.component';

describe('InstallmentWayCardComponent', () => {
  let component: InstallmentWayCardComponent;
  let fixture: ComponentFixture<InstallmentWayCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstallmentWayCardComponent]
    });
    fixture = TestBed.createComponent(InstallmentWayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
