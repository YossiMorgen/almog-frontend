import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TableFilterParams } from '../models/filter-schemas';
import { RouteFilterConfig, buildQueryParamsFromFilters, extractRouteKey } from '../config/route-filters.config';
import { FilterConfigService, DynamicFilterConfig } from './filter-config.service';

@Injectable({
  providedIn: 'root'
})
export class RouteFilterService {
  private currentRouteFiltersSubject = new BehaviorSubject<Partial<TableFilterParams>>({});
  private currentRouteConfigSubject = new BehaviorSubject<RouteFilterConfig | null>(null);
  private currentDynamicFiltersSubject = new BehaviorSubject<DynamicFilterConfig[]>([]);

  public currentRouteFilters$ = this.currentRouteFiltersSubject.asObservable();
  public currentRouteConfig$ = this.currentRouteConfigSubject.asObservable();
  public currentDynamicFilters$ = this.currentDynamicFiltersSubject.asObservable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private filterConfigService: FilterConfigService
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
    const routePath = extractRouteKey(url);
    const routeConfig = this.filterConfigService.getRouteConfig(routePath);
    
    if (routeConfig) {
      this.currentRouteConfigSubject.next(routeConfig);
      
      // Get dynamic filters for this route
      const dynamicFilters = this.filterConfigService.getDynamicFiltersForRoute(routePath);
      this.currentDynamicFiltersSubject.next(dynamicFilters);
      
      // Get current query params
      const currentParams = this.route.snapshot.queryParams;
      
      // Merge default filters with current params
      const mergedFilters = this.mergeFilters(routeConfig.defaultFilters, currentParams);
      
      this.currentRouteFiltersSubject.next(mergedFilters);
      
      // Update URL if needed
      this.updateUrlIfNeeded(mergedFilters, currentParams);
    } else {
      this.currentRouteConfigSubject.next(null);
      this.currentDynamicFiltersSubject.next([]);
      this.currentRouteFiltersSubject.next({});
    }
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

  getCurrentDynamicFilters(): DynamicFilterConfig[] {
    return this.currentDynamicFiltersSubject.value;
  }

  getFilterOptions(filterKey: string): Observable<any[]> {
    const routePath = extractRouteKey(this.router.url);
    return this.filterConfigService.getFilterOptions(routePath, filterKey);
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
