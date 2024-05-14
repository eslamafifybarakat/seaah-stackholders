import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionComponent } from './tuition.component';

describe('TuitionComponent', () => {
  let component: TuitionComponent;
  let fixture: ComponentFixture<TuitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TuitionComponent]
    });
    fixture = TestBed.createComponent(TuitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
