import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsRequestsComponent } from './kids-requests.component';

describe('KidsRequestsComponent', () => {
  let component: KidsRequestsComponent;
  let fixture: ComponentFixture<KidsRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KidsRequestsComponent]
    });
    fixture = TestBed.createComponent(KidsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
