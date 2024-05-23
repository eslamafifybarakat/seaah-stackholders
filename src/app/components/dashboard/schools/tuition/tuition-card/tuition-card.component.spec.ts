import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionCardComponent } from './tuition-card.component';

describe('TuitionCardComponent', () => {
  let component: TuitionCardComponent;
  let fixture: ComponentFixture<TuitionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuitionCardComponent]
    });
    fixture = TestBed.createComponent(TuitionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
