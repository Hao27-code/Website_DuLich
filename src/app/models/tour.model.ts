export interface Tour {
  /* mã tour */
  id: string;

  /* tên tour */
  title: string;

  /* địa điểm / thành phố */
  location: string;

  /* số ngày tour */
  days: number;

  /* giá tour */
  price: number;

  /* mô tả tour */
  description: string;

  /* danh sách ảnh */
  images: string[];
}
