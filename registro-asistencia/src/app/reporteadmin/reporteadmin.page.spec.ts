import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteadminPage } from './reporteadmin.page';

describe('ReporteadminPage', () => {
  let component: ReporteadminPage;
  let fixture: ComponentFixture<ReporteadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
