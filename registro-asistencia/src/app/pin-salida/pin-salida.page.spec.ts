import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinSalidaPage } from './pin-salida.page';

describe('PinSalidaPage', () => {
  let component: PinSalidaPage;
  let fixture: ComponentFixture<PinSalidaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PinSalidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
