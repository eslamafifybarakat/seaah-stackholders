import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCardComponent } from './bank-card.component';

describe('OrganizationCardComponent', () => {
  let component: OrganizationCardComponent;
  let fixture: ComponentFixture<OrganizationCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationCardComponent]
    });
    fixture = TestBed.createComponent(OrganizationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
