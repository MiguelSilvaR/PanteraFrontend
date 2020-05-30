import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartarNuevoComponent } from './apartar-nuevo.component';

describe('ApartarNuevoComponent', () => {
  let component: ApartarNuevoComponent;
  let fixture: ComponentFixture<ApartarNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartarNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartarNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
