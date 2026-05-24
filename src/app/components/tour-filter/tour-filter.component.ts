import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

// Thư viện custom select đẹp hơn select mặc định
import Choices from 'choices.js';

// Thư viện slider kéo khoảng giá trị
import noUiSlider from 'nouislider';

// Interface chứa kiểu dữ liệu filter tour
import { TourFilter } from 'src/app/models/tour-filter.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tour-filter',
  templateUrl: './tour-filter.component.html',
  styleUrls: ['./tour-filter.component.scss'],
  imports: [DecimalPipe],
})
export class TourFilterComponent implements AfterViewInit {
  /* ======================
      VIEWCHILD
      Lấy DOM element từ HTML
  ====================== */

  // Lấy select destination
  @ViewChild('destinationSelect')
  destinationSelect!: ElementRef;

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

  /* ======================
      LIFECYCLE
      Chạy sau khi HTML render xong
  ====================== */

  ngAfterViewInit(): void {
    // Khởi tạo select destination
    this.initDestination();

    // Khởi tạo slider giá
    this.initPriceSlider();

    // Khởi tạo slider thời lượng tour
    this.initDurationSlider();
  }

  /* ======================
      DESTINATION SELECT
      Choices.js
  ====================== */

  private initDestination(): void {
    // Tạo custom select
    const choices = new Choices(this.destinationSelect.nativeElement, {
      // Tắt search trong select
      searchEnabled: false,

      // Ẩn text select mặc định
      itemSelectText: '',
    });

    // Theo dõi khi user đổi destination
    this.destinationSelect.nativeElement.addEventListener(
      'change',
      (event: any) => {
        // Lưu destination vào filter
        this.filter.destination = event.target.value;
      },
    );
  }

  /* ======================
      PRICE SLIDER
      noUiSlider
  ====================== */

  private initPriceSlider(): void {
    // Tạo slider giá
    noUiSlider.create(this.priceSlider.nativeElement, {
      // Giá trị mặc định
      // 1tr -> 5tr
      start: [1000000, 5000000],

      // Nối vùng giữa slider
      connect: true,

      // Giới hạn giá
      range: {
        min: 0,
        max: 10000000,
      },
    });

    // Theo dõi khi user kéo slider
    this.priceSlider.nativeElement.noUiSlider.on(
      'update',
      (values: string[]) => {
        // Giá nhỏ nhất
        this.filter.minPrice = Math.round(Number(values[0]));

        // Giá lớn nhất
        this.filter.maxPrice = Math.round(Number(values[1]));
      },
    );
  }

  /* ======================
      DURATION SLIDER
      Slider số ngày
  ====================== */

  private initDurationSlider(): void {
    // Tạo slider duration
    noUiSlider.create(this.durationSlider.nativeElement, {
      // Mặc định 1 -> 7 ngày
      start: [1, 7],

      // Nối giữa slider
      connect: true,

      // Kéo từng bước 1 ngày
      step: 1,

      // Giới hạn 1 -> 30 ngày
      range: {
        min: 1,
        max: 30,
      },
    });

    // Theo dõi khi user kéo slider
    this.durationSlider.nativeElement.noUiSlider.on(
      'update',
      (values: string[]) => {
        // Số ngày tối thiểu
        this.filter.minDays = Math.round(Number(values[0]));

        // Số ngày tối đa
        this.filter.maxDays = Math.round(Number(values[1]));
      },
    );
  }

  /* ======================
      SUBMIT FILTER
      Gửi filter ra component cha
  ====================== */

  submitFilter(): void {
    // Emit filter hiện tại
    // Cha sẽ nhận qua (filterChange)
    this.filterChange.emit(this.filter);
  }

  private swapRange(min: number, max: number): [number, number] {
    if (min > max) {
      return [max, min];
    }

    return [min, max];
  }

  formatPrice(value?: number): string {
    if (!value) {
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
}
