import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessApprovalDialogComponent } from './access-approval-dialog.component';

describe('AccessApprovalDialogComponent', () => {
  let component: AccessApprovalDialogComponent;
  let fixture: ComponentFixture<AccessApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
