import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TourFilterComponent } from '../../components/tour-filter/tour-filter.component';
import { ActivatedRoute } from '@angular/router';

import { TourService } from 'src/app/services/tour';

import { TourFilter } from 'src/app/models/tour-filter.model';

import { TourResponse } from 'src/app/models/tour-response.model';

import { mapQueryToFilter } from 'src/app/utils/tour-filter.util';

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
  ],
})
export class ToursPage implements OnInit {
  // Biến lưu bộ lọc tour hiện tại
  // ! = chắc chắn sẽ được gán giá trị sau
  filters!: TourFilter;

  // Biến lưu danh sách tour lấy từ API
  // TourResponse['data'] = lấy kiểu của field data trong TourResponse
  tours: TourResponse['data'] = [];

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
  }

  // Hàm gọi API lấy danh sách tour
  loadTours(): void {
    // Gọi service và truyền filter hiện tại
    this.tourService.getTours(this.filters).subscribe({
      // next = chạy khi API thành công
      next: (response) => {
        // Lấy dữ liệu tours từ response
        // và lưu vào biến tours
        this.tours = response.data;
      },

      // error = chạy khi API lỗi
      error: (error) => {
        // In lỗi ra console để debug
        console.log(error);
      },
    });
  }
}
