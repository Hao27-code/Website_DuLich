import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Thư viện slider kéo khoảng giá trị
import noUiSlider from 'nouislider';

// Interface chứa kiểu dữ liệu filter tour
import { TourFilter } from 'src/app/models/tour-filter.model';
import { DecimalPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { Tour } from '../../models/tour.model';

@Component({
  selector: 'app-tour-filter',
  templateUrl: './tour-filter.component.html',
  styleUrls: ['./tour-filter.component.scss'],
  imports: [DecimalPipe, CommonModule, IonIcon],
})
export class TourFilterComponent implements AfterViewInit, OnChanges {
  constructor() {
    addIcons({
      chevronDownOutline,
    });
  }
  showDuration = false;

  showPrice = false;
  /* ======================
      VIEWCHILD
      Lấy DOM element từ HTML
  ====================== */

  // Lấy slider giá
  @ViewChild('priceSlider')
  priceSlider!: ElementRef;

  // Lấy slider số ngày
  @ViewChild('durationSlider')
  durationSlider!: ElementRef;

  /* ======================
      INPUT
      Nhận dữ liệu từ component cha
      Sync với ToursPage
  ====================== */

  @Input()
  filters?: TourFilter;

  @Input()
  tours: Tour[] = [];

  /* ======================
      OUTPUT
      Gửi dữ liệu từ con -> cha
  ====================== */

  @Output()
  filterChange = new EventEmitter<TourFilter>();

  /* ======================
      STATE
      Trạng thái filter hiện tại
  ====================== */

  // Giá trị filter local của component
  filter: TourFilter = {
    // Trang mặc định
    page: 1,

    // Số item mặc định
    limit: 12,
  };
  private priceSliderInit = false;
  private durationSliderInit = false;
  /* ======================
      LIFECYCLE
      Chạy sau khi HTML render xong
  ====================== */

  ngAfterViewInit(): void {}

  /* ======================
      PRICE SLIDER
      noUiSlider
  ====================== */

  private initPriceSlider(): void {
    noUiSlider.create(this.priceSlider.nativeElement, {
      start: [1000000, 5000000],
      connect: true,
      range: {
        min: 0,
        max: 10000000,
      },
    });

    this.priceSlider.nativeElement.noUiSlider.on(
      'update',
      (values: string[]) => {
        this.filter.minPrice = Math.round(Number(values[0]));

        this.filter.maxPrice = Math.round(Number(values[1]));
      },
    );
    this.priceSlider.nativeElement.noUiSlider.on('end', () => {
      this.showPrice = false;

      const activeEl = document.activeElement as HTMLElement;

      activeEl?.blur();
    });
  }

  /* ======================
      DURATION SLIDER
      Slider số ngày
  ====================== */

  private initDurationSlider(): void {
    noUiSlider.create(this.durationSlider.nativeElement, {
      start: [1, 7],
      connect: true,
      step: 1,
      range: {
        min: 1,
        max: 30,
      },
    });

    this.durationSlider.nativeElement.noUiSlider.on(
      'update',
      (values: string[]) => {
        this.filter.minDays = Math.round(Number(values[0]));

        this.filter.maxDays = Math.round(Number(values[1]));
      },
    );
    this.durationSlider.nativeElement.noUiSlider.on('end', () => {
      this.showDuration = false;

      const activeEl = document.activeElement as HTMLElement;

      activeEl?.blur();
    });
  }

  /* ======================
      SUBMIT FILTER
      Gửi filter ra component cha
  ====================== */

  submitFilter(): void {
    this.filterChange.emit(this.filter);
  }

  private swapRange(min: number, max: number): [number, number] {
    if (min > max) {
      return [max, min];
    }

    return [min, max];
  }

  formatPrice(value?: number): string {
    if (value === undefined || value === null) {
      return '';
    }

    return value.toLocaleString('vi-VN') + 'đ';
  }
  private parsePrice(value: string): number {
    return Number(value.replace(/\D/g, ''));
  }
  onMinPriceChange(event: any): void {
    const value = this.parsePrice(event.target.value);

    let min = value;

    let max = this.filter.maxPrice || 0;

    [min, max] = this.swapRange(min, max);

    this.filter.minPrice = min;

    this.filter.maxPrice = max;

    this.priceSlider.nativeElement.noUiSlider.set([min, max]);
  }
  onMaxPriceChange(event: any): void {
    const value = this.parsePrice(event.target.value);

    let min = this.filter.minPrice || 0;

    let max = value;

    [min, max] = this.swapRange(min, max);

    this.filter.minPrice = min;

    this.filter.maxPrice = max;

    this.priceSlider.nativeElement.noUiSlider.set([min, max]);
  }
  onMinDaysChange(event: any): void {
    let min = Number(event.target.value);

    let max = this.filter.maxDays || 30;

    [min, max] = this.swapRange(min, max);

    this.filter.minDays = min;

    this.filter.maxDays = max;

    this.durationSlider.nativeElement.noUiSlider.set([min, max]);
  }
  onMaxDaysChange(event: any): void {
    let min = this.filter.minDays || 1;

    let max = Number(event.target.value);

    [min, max] = this.swapRange(min, max);

    this.filter.minDays = min;

    this.filter.maxDays = max;

    this.durationSlider.nativeElement.noUiSlider.set([min, max]);
  }

  toggleDuration(): void {
    this.showDuration = !this.showDuration;
    this.showPrice = false;

    if (this.showDuration && !this.durationSliderInit) {
      setTimeout(() => {
        this.initDurationSlider();
        this.durationSliderInit = true;
      });
    }
  }
  togglePrice(): void {
    this.showPrice = !this.showPrice;
    this.showDuration = false;

    if (this.showPrice && !this.priceSliderInit) {
      setTimeout(() => {
        this.initPriceSlider();
        this.priceSliderInit = true;
      });
    }
  }

  showDestination = false;

  toggleDestination(destination: string): void {
    this.filter.destination = [destination];

    this.showDestination = false;
  }

  get destinations(): string[] {
    return [...new Set(this.tours.map((t) => t.location))];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      this.filter = {
        ...this.filters,
      };

      if (this.priceSliderInit && this.priceSlider?.nativeElement?.noUiSlider) {
        this.priceSlider.nativeElement.noUiSlider.set([
          this.filter.minPrice ?? 1000000,

          this.filter.maxPrice ?? 5000000,
        ]);
      }

      if (
        this.durationSliderInit &&
        this.durationSlider?.nativeElement?.noUiSlider
      ) {
        this.durationSlider.nativeElement.noUiSlider.set([
          this.filter.minDays ?? 1,

          this.filter.maxDays ?? 7,
        ]);
      }
    }
  }
}
