import { TableFilterParams } from '../models/filter-schemas';
import { FilterConfigService, RouteFilterConfig } from '../services/filter-config.service';

// Re-export types for backward compatibility
export type { RouteFilterConfig, DynamicFilterConfig, FilterOption } from '../services/filter-config.service';

// Legacy function for backward compatibility - now uses the service
export function getDefaultFiltersForRoute(routePath: string): RouteFilterConfig | null {
  const routeKey = routePath.replace('/crm/', '').split('/')[0];
  // This will be replaced by service injection in components
  return null; // Components should use FilterConfigService directly
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

// Helper function to get route key from URL
export function extractRouteKey(url: string): string {
  const urlParts = url.split('?')[0].split('/');
  const crmIndex = urlParts.indexOf('crm');
  
  if (crmIndex !== -1 && crmIndex + 1 < urlParts.length) {
    return urlParts[crmIndex + 1];
  }
  
  return '';
}
