import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerEmpleadoPage } from './ver-empleado.page';

describe('VerEmpleadoPage', () => {
  let component: VerEmpleadoPage;
  let fixture: ComponentFixture<VerEmpleadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
