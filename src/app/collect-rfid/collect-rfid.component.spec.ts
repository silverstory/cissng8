import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectRfidComponent } from './collect-rfid.component';

describe('CollectRfidComponent', () => {
  let component: CollectRfidComponent;
  let fixture: ComponentFixture<CollectRfidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectRfidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
