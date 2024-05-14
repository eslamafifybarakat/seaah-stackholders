import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsListComponent } from './kids-requests-list.componet';

describe('KidsListComponent', () => {
  let component: KidsListComponent;
  let fixture: ComponentFixture<KidsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsListComponent]
    });
    fixture = TestBed.createComponent(KidsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
