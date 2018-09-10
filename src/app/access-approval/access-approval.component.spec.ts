import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessApprovalComponent } from './access-approval.component';

describe('AccessApprovalComponent', () => {
  let component: AccessApprovalComponent;
  let fixture: ComponentFixture<AccessApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
