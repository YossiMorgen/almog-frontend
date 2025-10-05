import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TableFilterParams } from '../models/filter-schemas';
import { DEFAULT_ROUTE_FILTERS, RouteFilterConfig, buildQueryParamsFromFilters } from '../config/route-filters.config';

@Injectable({
  providedIn: 'root'
})
export class RouteFilterService {
  private currentRouteFiltersSubject = new BehaviorSubject<Partial<TableFilterParams>>({});
  private currentRouteConfigSubject = new BehaviorSubject<RouteFilterConfig | null>(null);

  public currentRouteFilters$ = this.currentRouteFiltersSubject.asObservable();
  public currentRouteConfig$ = this.currentRouteConfigSubject.asObservable();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeRouteTracking();
  }

  private initializeRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateRouteFilters(event.url);
    });

    // Initial load
    this.updateRouteFilters(this.router.url);
  }

  private updateRouteFilters(url: string): void {
    const routePath = this.extractRoutePath(url);
    const routeConfig = this.getRouteConfig(routePath);
    
    if (routeConfig) {
      this.currentRouteConfigSubject.next(routeConfig);
      
      // Get current query params
      const currentParams = this.route.snapshot.queryParams;
      
      // Merge default filters with current params
      const mergedFilters = this.mergeFilters(routeConfig.defaultFilters, currentParams);
      
      this.currentRouteFiltersSubject.next(mergedFilters);
      
      // Update URL if needed
      this.updateUrlIfNeeded(mergedFilters, currentParams);
    } else {
      this.currentRouteConfigSubject.next(null);
      this.currentRouteFiltersSubject.next({});
    }
  }

  private extractRoutePath(url: string): string {
    // Extract the route path from URL
    const urlParts = url.split('?')[0].split('/');
    const crmIndex = urlParts.indexOf('crm');
    
    if (crmIndex !== -1 && crmIndex + 1 < urlParts.length) {
      return urlParts[crmIndex + 1];
    }
    
    return '';
  }

  private getRouteConfig(routePath: string): RouteFilterConfig | null {
    return DEFAULT_ROUTE_FILTERS[routePath] || null;
  }

  private mergeFilters(defaultFilters: Partial<TableFilterParams>, currentParams: any): Partial<TableFilterParams> {
    const merged: Partial<TableFilterParams> = { ...defaultFilters };
    
    // Override with current URL params
    Object.keys(currentParams).forEach(key => {
      const value = currentParams[key];
      if (value !== null && value !== undefined && value !== '') {
        // Convert string values to appropriate types
        if (key === 'page' || key === 'limit') {
          merged[key as keyof TableFilterParams] = parseInt(value) as any;
        } else if (key === 'sortOrder') {
          merged[key as keyof TableFilterParams] = value as any;
        } else {
          merged[key as keyof TableFilterParams] = value as any;
        }
      }
    });
    
    return merged;
  }

  private updateUrlIfNeeded(newFilters: Partial<TableFilterParams>, currentParams: any): void {
    const queryParams = buildQueryParamsFromFilters(newFilters);
    
    // Check if URL needs to be updated
    const needsUpdate = Object.keys(queryParams).some(key => 
      queryParams[key] !== currentParams[key]
    ) || Object.keys(currentParams).some(key => 
      !queryParams.hasOwnProperty(key) && currentParams[key] !== null && currentParams[key] !== undefined && currentParams[key] !== ''
    );
    
    if (needsUpdate) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'replace',
        replaceUrl: true
      });
    }
  }

  getCurrentRouteFilters(): Partial<TableFilterParams> {
    return this.currentRouteFiltersSubject.value;
  }

  getCurrentRouteConfig(): RouteFilterConfig | null {
    return this.currentRouteConfigSubject.value;
  }

  updateFilters(filters: Partial<TableFilterParams>): void {
    const currentConfig = this.getCurrentRouteConfig();
    if (currentConfig) {
      const mergedFilters = this.mergeFilters(currentConfig.defaultFilters, filters);
      this.currentRouteFiltersSubject.next(mergedFilters);
      
      const queryParams = buildQueryParamsFromFilters(mergedFilters);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  resetToDefaults(): void {
    const currentConfig = this.getCurrentRouteConfig();
    if (currentConfig) {
      this.currentRouteFiltersSubject.next(currentConfig.defaultFilters);
      
      const queryParams = buildQueryParamsFromFilters(currentConfig.defaultFilters);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'replace',
        replaceUrl: true
      });
    }
  }

  clearFilters(): void {
    this.currentRouteFiltersSubject.next({});
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'replace',
      replaceUrl: true
    });
  }
}
