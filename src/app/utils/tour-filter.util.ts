import { Params } from '@angular/router';

import { TourFilter } from '../models/tour-filter.model';

export function mapQueryToFilter(query: Params): TourFilter {
  return {
    destination: query['destination'] || undefined,

    minPrice: query['minPrice'] ? Number(query['minPrice']) : undefined,

    maxPrice: query['maxPrice'] ? Number(query['maxPrice']) : undefined,

    minDays: query['minDays'] ? Number(query['minDays']) : undefined,

    maxDays: query['maxDays'] ? Number(query['maxDays']) : undefined,

    keyword: query['keyword'] || undefined,

    page: query['page'] ? Number(query['page']) : 1,

    limit: query['limit'] ? Number(query['limit']) : 12,

    sort: query['sort'] || undefined,
  };
}
