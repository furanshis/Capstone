import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarPinPage } from './cambiar-pin.page';

describe('CambiarPinPage', () => {
  let component: CambiarPinPage;
  let fixture: ComponentFixture<CambiarPinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
