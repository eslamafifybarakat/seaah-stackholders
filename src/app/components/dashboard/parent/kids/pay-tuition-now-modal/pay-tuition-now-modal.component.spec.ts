import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayTuitionNowModalComponent } from './pay-tuition-now-modal.component';

describe('PayTuitionNowModalComponent', () => {
  let component: PayTuitionNowModalComponent;
  let fixture: ComponentFixture<PayTuitionNowModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayTuitionNowModalComponent]
    });
    fixture = TestBed.createComponent(PayTuitionNowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
