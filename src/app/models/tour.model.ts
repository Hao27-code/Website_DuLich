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
  discountPrice?: number; /*giảm giá*/

  /* mô tả tour */
  description: string;

  /* thời gian kết thúc ưu đãi*/
  dealEndDate?: string;

  /* danh sách ảnh */
  imagePath: string;

  activities?: string;
  tripType?: string;
  difficulty?: string;
}
