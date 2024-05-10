import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMultiFilesFromServerComponent } from './upload-multi-files-from-server.component';

describe('UploadMultiFilesFromServerComponent', () => {
  let component: UploadMultiFilesFromServerComponent;
  let fixture: ComponentFixture<UploadMultiFilesFromServerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadMultiFilesFromServerComponent]
    });
    fixture = TestBed.createComponent(UploadMultiFilesFromServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
