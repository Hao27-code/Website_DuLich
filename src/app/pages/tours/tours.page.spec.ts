import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToursPage } from './tours.page';

describe('ToursPage', () => {
  let component: ToursPage;
  let fixture: ComponentFixture<ToursPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ToursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
