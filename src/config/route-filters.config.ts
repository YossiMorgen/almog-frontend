import { TableFilterParams } from '../models/filter-schemas';

export interface RouteFilterConfig {
  defaultFilters: Partial<TableFilterParams>;
  filterType: string;
}

export const DEFAULT_ROUTE_FILTERS: Record<string, RouteFilterConfig> = {
  'students': {
    filterType: 'students',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      status: 'active'
    }
  },
  'courses': {
    filterType: 'courses',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      status: 'open'
    }
  },
  'classes': {
    filterType: 'classes',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      status: 'scheduled'
    }
  },
  'classes-locations': {
    filterType: 'classes-locations',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      is_active: true
    }
  },
  'users': {
    filterType: 'users',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      status: 'active'
    }
  },
  'products': {
    filterType: 'products',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  },
  'orders': {
    filterType: 'orders',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc',
      status: 'pending'
    }
  },
  'payments': {
    filterType: 'payments',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc',
      status: 'pending'
    }
  },
  'seasons': {
    filterType: 'seasons',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  },
  'roles': {
    filterType: 'roles',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  },
  'permissions': {
    filterType: 'permissions',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  },
  'course-enrollments': {
    filterType: 'course-enrollments',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },
  'student-classes': {
    filterType: 'student-classes',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },
  'order-items': {
    filterType: 'order-items',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },
  'payment-installments': {
    filterType: 'payment-installments',
    defaultFilters: {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  }
};

export function getDefaultFiltersForRoute(routePath: string): RouteFilterConfig | null {
  const routeKey = routePath.replace('/crm/', '').split('/')[0];
  return DEFAULT_ROUTE_FILTERS[routeKey] || null;
}

export function buildQueryParamsFromFilters(filters: Partial<TableFilterParams>): Record<string, string> {
  const queryParams: Record<string, string> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams[key] = String(value);
    }
  });
  
  return queryParams;
}
