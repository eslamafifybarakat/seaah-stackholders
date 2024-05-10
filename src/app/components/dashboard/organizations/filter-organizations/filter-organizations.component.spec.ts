import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOrganizationsComponent } from './filter-organizations.component';

describe('FilterOrganizationsComponent', () => {
  let component: FilterOrganizationsComponent;
  let fixture: ComponentFixture<FilterOrganizationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterOrganizationsComponent]
    });
    fixture = TestBed.createComponent(FilterOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
