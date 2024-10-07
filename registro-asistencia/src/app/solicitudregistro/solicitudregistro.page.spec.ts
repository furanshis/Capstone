import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudregistroPage } from './solicitudregistro.page';

describe('SolicitudregistroPage', () => {
  let component: SolicitudregistroPage;
  let fixture: ComponentFixture<SolicitudregistroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudregistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
