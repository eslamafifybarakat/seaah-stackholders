import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOrganizationComponent } from './add-edit-organization.component';

describe('AddEditOrganizationComponent', () => {
  let component: AddEditOrganizationComponent;
  let fixture: ComponentFixture<AddEditOrganizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditOrganizationComponent]
    });
    fixture = TestBed.createComponent(AddEditOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
