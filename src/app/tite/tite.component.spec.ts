import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiteComponent } from './tite.component';

describe('TiteComponent', () => {
  let component: TiteComponent;
  let fixture: ComponentFixture<TiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
