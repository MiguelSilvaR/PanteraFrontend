import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartadoComponent } from './apartado.component';

describe('ApartadoComponent', () => {
  let component: ApartadoComponent;
  let fixture: ComponentFixture<ApartadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
