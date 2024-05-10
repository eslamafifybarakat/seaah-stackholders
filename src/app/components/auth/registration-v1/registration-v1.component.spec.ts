import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationV1Component } from './registration-v1.component';

describe('RegistrationV1Component', () => {
  let component: RegistrationV1Component;
  let fixture: ComponentFixture<RegistrationV1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationV1Component]
    });
    fixture = TestBed.createComponent(RegistrationV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
