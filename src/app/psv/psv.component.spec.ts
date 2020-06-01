import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsvComponent } from './psv.component';

describe('PsvComponent', () => {
  let component: PsvComponent;
  let fixture: ComponentFixture<PsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
