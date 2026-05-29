import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TourFilterComponent } from '../../components/tour-filter/tour-filter.component';
import { ActivatedRoute } from '@angular/router';

import { TourService } from 'src/app/services/tour';

import { TourFilter } from 'src/app/models/tour-filter.model';

import { TourResponse } from 'src/app/models/tour-response.model';

import { mapQueryToFilter } from 'src/app/utils/tour-filter.util';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.page.html',
  styleUrls: ['./tours.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TourFilterComponent,
    TourCardComponent,
    IonIcon,
  ],
})
export class ToursPage implements OnInit {
  // Biến lưu bộ lọc tour hiện tại
  // ! = chắc chắn sẽ được gán giá trị sau
  filters!: TourFilter;

  destinations: string[] = [];
  // Biến lưu danh sách tour lấy từ API
  // TourResponse['data'] = lấy kiểu của field data trong TourResponse
  tours: TourResponse['data'] = [];
  /*====================
  FILTER DATA
====================*/

  activitiesList: string[] = [
    'Hiking',
    'Jungle Safari',
    'Peak Climbing',
    'Road Cycling',
    'Skiing',
  ];

  tripTypesList: string[] = ['Budget Travel', 'Nature Walk', 'Weekend Trips'];
  loading = false;
  // inject ActivatedRoute để đọc query params trên URL
  // Ví dụ:
  // /tours?destination=DaNang&page=2
  private route = inject(ActivatedRoute);

  // inject TourService để gọi API tours
  private tourService = inject(TourService);

  // Lifecycle hook (vòng đời component)
  // chạy khi component được khởi tạo
  ngOnInit(): void {
    // Lắng nghe query params trên URL
    // subscribe = theo dõi sự thay đổi
    this.route.queryParams.subscribe((params) => {
      // Chuyển query params từ URL
      // thành object TourFilter chuẩn
      this.filters = mapQueryToFilter(params);

      // Sau khi có filter thì gọi API load tours
      this.loadTours();
    });
    this.updateSliderPercents();
  }

  // Hàm gọi API lấy danh sách tour
  loadTours(): void {
    this.loading = true;

    this.tourService.getTours(this.filters).subscribe({
      next: (response) => {
        this.tours = response.data;

        /* destination động */

        this.destinations = [
          ...new Set(response.data.map((tour) => tour.location)),
        ];

        this.loading = false;
      },

      error: (error) => {
        console.log(error);

        this.loading = false;
      },
    });
  }

  /*====================
  ACTIVITIES
====================*/

  toggleActivity(activity: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (!this.filters.activities) {
      this.filters.activities = [];
    }

    if (checked) {
      this.filters.activities.push(activity);
    } else {
      this.filters.activities = this.filters.activities.filter(
        (a) => a !== activity,
      );
    }

    this.loadTours();
  }

  /*====================
    TRIP TYPE
  ====================*/

  toggleTripType(type: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (!this.filters.tripTypes) {
      this.filters.tripTypes = [];
    }

    if (checked) {
      this.filters.tripTypes.push(type);
    } else {
      this.filters.tripTypes = this.filters.tripTypes.filter((t) => t !== type);
    }

    this.loadTours();
  }

  /*====================
    DIFFICULTY
  ====================*/

  setDifficulty(difficulty: string): void {
    if (this.filters.difficulty === difficulty) {
      this.filters.difficulty = undefined;
    } else {
      this.filters.difficulty = difficulty;
    }

    this.loadTours();
  }

  /*====================
    RESET
  ====================*/

  resetFilters(): void {
    this.filters = {
      page: 1,
      limit: 12,
    };

    this.loadTours();
  }

  showDestination = true;
  showPrice = true;
  showDuration = true;
  showActivities = true;
  showTripType = true;
  showDifficulty = true;

  showAllDestination = false;
  showAllActivities = false;

  toggleSection(section: string): void {
    switch (section) {
      case 'destination':
        this.showDestination = !this.showDestination;
        break;

      case 'price':
        this.showPrice = !this.showPrice;
        break;

      case 'duration':
        this.showDuration = !this.showDuration;
        break;

      case 'activities':
        this.showActivities = !this.showActivities;
        break;

      case 'tripType':
        this.showTripType = !this.showTripType;
        break;

      case 'difficulty':
        this.showDifficulty = !this.showDifficulty;
        break;
    }
  }
  toggleShowAllDestination() {
    this.showAllDestination = !this.showAllDestination;
  }

  toggleShowAllActivities() {
    this.showAllActivities = !this.showAllActivities;
  }

  toggleDestination(location: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (!this.filters.destination) {
      this.filters.destination = [];
    }

    if (checked) {
      this.filters.destination.push(location);
    } else {
      this.filters.destination = this.filters.destination.filter(
        (item) => item !== location,
      );
    }

    this.loadTours();
  }

  priceMinPercent = 0;
  priceMaxPercent = 100;

  daysMinPercent = 0;
  daysMaxPercent = 100;

  updateSliderPercents(): void {
    /* PRICE */

    const priceMin = 1299000;
    const priceMax = 2799000;

    const minPrice = this.filters.minPrice ?? priceMin;

    const maxPrice = this.filters.maxPrice ?? priceMax;

    this.priceMinPercent =
      ((minPrice - priceMin) / (priceMax - priceMin)) * 100;

    this.priceMaxPercent =
      ((maxPrice - priceMin) / (priceMax - priceMin)) * 100;

    /* DAYS */

    const minDays = this.filters.minDays ?? 0;

    const maxDays = this.filters.maxDays ?? 5;

    this.daysMinPercent = (minDays / 5) * 100;

    this.daysMaxPercent = (maxDays / 5) * 100;
  }

  onPriceMinChange(): void {
    if ((this.filters.minPrice ?? 0) > (this.filters.maxPrice ?? 0)) {
      this.filters.minPrice = this.filters.maxPrice;
    }

    this.updateSliderPercents();
    this.loadTours();
  }

  onPriceMaxChange(): void {
    if ((this.filters.maxPrice ?? 0) < (this.filters.minPrice ?? 0)) {
      this.filters.maxPrice = this.filters.minPrice;
    }

    this.updateSliderPercents();
    this.loadTours();
  }

  onDaysMinChange(): void {
    if ((this.filters.minDays ?? 0) > (this.filters.maxDays ?? 0)) {
      this.filters.minDays = this.filters.maxDays;
    }

    this.updateSliderPercents();
    this.loadTours();
  }

  onDaysMaxChange(): void {
    if ((this.filters.maxDays ?? 0) < (this.filters.minDays ?? 0)) {
      this.filters.maxDays = this.filters.minDays;
    }

    this.updateSliderPercents();
    this.loadTours();
  }
}
