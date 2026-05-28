import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

import { TourService } from 'src/app/services/tour';

import { Tour } from 'src/app/models/tour.model';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit, OnDestroy {
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  dealTours: Tour[] = [];

  activeTour: Tour | null = null;
  openedTourId: string | null = null;

  private countdownInterval: any;

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.loadDeals();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  loadDeals(): void {
    this.tourService.getDealTours().subscribe({
      next: (tours: Tour[]) => {
        this.dealTours = tours;

        if (tours.length) {
          this.activeTour = tours[0];
          this.startCountdown();
        }
      },
    });
  }

  selectTour(tour: Tour): void {
    if (this.openedTourId === tour.id) {
      this.openedTourId = null;
    } else {
      this.openedTourId = tour.id;
      this.activeTour = tour;
      this.startCountdown();
    }
  }

  startCountdown(): void {
    clearInterval(this.countdownInterval);

    if (!this.activeTour?.dealEndDate) {
      return;
    }

    const target = new Date(this.activeTour.dealEndDate).getTime();

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();

      const distance = target - now;

      if (distance <= 0) {
        clearInterval(this.countdownInterval);

        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;

        return;
      }

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));

      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }
}
