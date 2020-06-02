import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReservacionComponent } from './ver-reservacion.component';

describe('VerReservacionComponent', () => {
  let component: VerReservacionComponent;
  let fixture: ComponentFixture<VerReservacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerReservacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerReservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
