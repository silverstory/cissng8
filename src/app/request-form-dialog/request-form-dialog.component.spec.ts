import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFormDialogComponent } from './request-form-dialog.component';

describe('RequestFormDialogComponent', () => {
  let component: RequestFormDialogComponent;
  let fixture: ComponentFixture<RequestFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
