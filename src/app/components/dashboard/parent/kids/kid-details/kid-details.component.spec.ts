import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidDetailsComponent } from './kid-details.component';

describe('KidDetailsComponent', () => {
  let component: KidDetailsComponent;
  let fixture: ComponentFixture<KidDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidDetailsComponent]
    });
    fixture = TestBed.createComponent(KidDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
