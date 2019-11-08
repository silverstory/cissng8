import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivefeedComponent } from './livefeed.component';

describe('LivefeedComponent', () => {
  let component: LivefeedComponent;
  let fixture: ComponentFixture<LivefeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivefeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivefeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
