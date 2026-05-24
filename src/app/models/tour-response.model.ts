import { Tour } from './tour.model';

export interface TourResponse {
  data: Tour[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}
