import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TourFilter } from '../models/tour-filter.model';
import { TourResponse } from '../models/tour-response.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  /* địa chỉ API tour */
  private readonly apiUrl = 'http://localhost:3000/tours';

  /* inject HttpClient để gọi API */
  private http = inject(HttpClient);

  /* lấy danh sách tour */

  getTours(filters: TourFilter): Observable<TourResponse> {
    /* tạo query params rỗng */
    let params = new HttpParams();

    /* =======================
       filter điểm đến
    ======================= */

    if (filters.destination) {
      params = params.set('destination', filters.destination);
    }

    /* =======================
       filter giá
    ======================= */

    /* giá nhỏ nhất */

    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice);
    }

    /* giá lớn nhất */

    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice);
    }

    /* =======================
       filter thời lượng tour
    ======================= */

    /* số ngày tối thiểu */

    if (filters.minDays !== undefined) {
      params = params.set('minDays', filters.minDays);
    }

    /* số ngày tối đa */

    if (filters.maxDays !== undefined) {
      params = params.set('maxDays', filters.maxDays);
    }

    /* =======================
       filter từ khóa tìm kiếm
    ======================= */

    if (filters.keyword) {
      params = params.set('keyword', filters.keyword);
    }

    /* =======================
       phân trang
    ======================= */

    /* trang hiện tại */

    params = params.set('page', filters.page || 1);

    /* số tour mỗi trang */

    params = params.set('limit', filters.limit || 12);

    /* =======================
       sắp xếp
    ======================= */

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    /* gọi API GET và gửi params */

    return this.http.get<TourResponse>(this.apiUrl, {
      params,
    });
  }
}
