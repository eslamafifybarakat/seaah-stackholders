import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionsListComponent } from './tuitions-list.component';

describe('TuitionsListComponent', () => {
  let component: TuitionsListComponent;
  let fixture: ComponentFixture<TuitionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TuitionsListComponent]
    });
    fixture = TestBed.createComponent(TuitionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
