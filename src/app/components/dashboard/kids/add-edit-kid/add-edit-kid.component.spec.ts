import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditKidComponent } from './add-edit-kid.component';

describe('AddEditKidComponent', () => {
  let component: AddEditKidComponent;
  let fixture: ComponentFixture<AddEditKidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditKidComponent]
    });
    fixture = TestBed.createComponent(AddEditKidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
