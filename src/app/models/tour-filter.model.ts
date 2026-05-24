export interface TourFilter {
  /* destination */
  destination?: string;

  /* price */
  minPrice?: number;
  maxPrice?: number;

  /* duration */
  minDays?: number;
  maxDays?: number;

  /* search */
  keyword?: string;

  /* pagination */
  page?: number;
  limit?: number;

  /* sort */
  sort?: string;
}
