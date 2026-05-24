import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TourDetailsPage } from './tour-details.page';

describe('TourDetailsPage', () => {
  let component: TourDetailsPage;
  let fixture: ComponentFixture<TourDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
