import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LockscreenPage } from './lockscreen.page';

describe('LockscreenPage', () => {
  let component: LockscreenPage;
  let fixture: ComponentFixture<LockscreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LockscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
