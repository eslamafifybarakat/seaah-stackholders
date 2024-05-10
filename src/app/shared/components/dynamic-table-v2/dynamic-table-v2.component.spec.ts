import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableV2Component } from './dynamic-table-v2.component';

describe('DynamicTableV2Component', () => {
  let component: DynamicTableV2Component;
  let fixture: ComponentFixture<DynamicTableV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicTableV2Component]
    });
    fixture = TestBed.createComponent(DynamicTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
