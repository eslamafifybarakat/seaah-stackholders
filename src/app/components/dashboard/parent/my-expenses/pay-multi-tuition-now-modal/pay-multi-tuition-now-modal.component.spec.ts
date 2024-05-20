import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMultiTuitionNowModalComponent } from './pay-multi-tuition-now-modal.component';

describe('PayTuitionNowModalComponent', () => {
  let component: PayMultiTuitionNowModalComponent;
  let fixture: ComponentFixture<PayMultiTuitionNowModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayMultiTuitionNowModalComponent]
    });
    fixture = TestBed.createComponent(PayMultiTuitionNowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
