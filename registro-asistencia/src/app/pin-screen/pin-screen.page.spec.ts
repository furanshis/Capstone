import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinScreenPage } from './pin-screen.page';

describe('PinScreenPage', () => {
  let component: PinScreenPage;
  let fixture: ComponentFixture<PinScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PinScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
