import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TableFilterParams } from '../models/filter-schemas';
import { RouteFilterService } from './route-filter.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private showFiltersSubject = new BehaviorSubject<boolean>(this.getInitialFilterState());
  private currentFilterTypeSubject = new BehaviorSubject<string>('');

  public showFilters$ = this.showFiltersSubject.asObservable();
  public currentFilterType$ = this.currentFilterTypeSubject.asObservable();

  constructor(
    private routeFilterService: RouteFilterService,
    private router: Router
  ) {
    this.initializeUrlTracking();
  }

  private initializeUrlTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateFilterVisibility(event.url);
    });

    // Initial load
    this.updateFilterVisibility(this.router.url);
  }

  private updateFilterVisibility(url: string): void {
    const shouldShowFilters = this.shouldShowFiltersForUrl(url);
    this.showFiltersSubject.next(shouldShowFilters);
    
    if (shouldShowFilters) {
      const filterType = this.extractFilterTypeFromUrl(url);
      if (filterType) {
        this.currentFilterTypeSubject.next(filterType);
      }
    } else {
      this.currentFilterTypeSubject.next('');
    }
  }

  private shouldShowFiltersForUrl(url: string): boolean {
    // Extract the path without query parameters
    const path = url.split('?')[0];
    
    // Extract the path after /crm/
    const crmIndex = path.indexOf('/crm/');
    if (crmIndex === -1) {
      return false;
    }
    
    const routePath = path.substring(crmIndex + 5); // +5 to skip '/crm/'
    
    // Check if this is a table/list route (base route without additional segments)
    const routeSegments = routePath.split('/').filter(segment => segment.length > 0);
    const baseRoute = routeSegments[0];
    
    // Define routes that should show filters (table/list views)
    const tableRoutes = [
      'students', 'courses', 'classes', 'classes-locations', 'users', 
      'products', 'orders', 'payments', 'seasons', 'roles', 'permissions',
      'course-enrollments', 'student-classes', 'order-items', 'payment-installments'
    ];
    
    // Show filters only if:
    // 1. It's a known table route
    // 2. It's exactly the base route (no additional segments like /new, /:id, /edit)
    return tableRoutes.includes(baseRoute) && routeSegments.length === 1;
  }

  private extractFilterTypeFromUrl(url: string): string {
    const path = url.split('?')[0];
    
    // Extract the path after /crm/
    const crmIndex = path.indexOf('/crm/');
    if (crmIndex === -1) {
      return '';
    }
    
    const routePath = path.substring(crmIndex + 5); // +5 to skip '/crm/'
    const routeSegments = routePath.split('/').filter(segment => segment.length > 0);
    const baseRoute = routeSegments[0];
    
    // Map route names to filter types
    const routeToFilterTypeMap: Record<string, string> = {
      'students': 'students',
      'courses': 'courses',
      'classes': 'classes',
      'classes-locations': 'classes-locations',
      'users': 'users',
      'products': 'products',
      'orders': 'orders',
      'payments': 'payments',
      'seasons': 'seasons',
      'roles': 'roles',
      'permissions': 'permissions',
      'course-enrollments': 'course-enrollments',
      'student-classes': 'student-classes',
      'order-items': 'order-items',
      'payment-installments': 'payment-installments'
    };
    
    return routeToFilterTypeMap[baseRoute] || '';
  }

  toggleFilters(): void {
    // Only allow toggling if we're on a route that should show filters
    const currentUrl = this.router.url;
    const shouldShowFilters = this.shouldShowFiltersForUrl(currentUrl);
    
    if (shouldShowFilters) {
      const newState = !this.showFiltersSubject.value;
      this.showFiltersSubject.next(newState);
      this.saveFilterState(newState);
    }
  }

  setShowFilters(show: boolean): void {
    // Always respect the show parameter - let the calling component decide
    this.showFiltersSubject.next(show);
    this.saveFilterState(show);
  }

  setFilterType(filterType: string): void {
    this.currentFilterTypeSubject.next(filterType);
  }

  updateFilterParams(params: Partial<TableFilterParams>): void {
    this.routeFilterService.updateFilters(params);
  }

  getCurrentFilterType(): string {
    return this.currentFilterTypeSubject.value;
  }

  getCurrentFilterParams(): Partial<TableFilterParams> {
    return this.routeFilterService.getCurrentRouteFilters();
  }

  clearFilters(): void {
    this.routeFilterService.clearFilters();
  }

  resetToDefaults(): void {
    this.routeFilterService.resetToDefaults();
  }

  hasActiveFilters(): boolean {
    const params = this.getCurrentFilterParams();
    return Object.keys(params).length > 0 && Object.values(params).some(value => 
      value !== null && value !== undefined && value !== ''
    );
  }

  getActiveFilterCount(): number {
    const params = this.getCurrentFilterParams();
    return Object.values(params).filter(value => 
      value !== null && value !== undefined && value !== ''
    ).length;
  }

  private getInitialFilterState(): boolean {
    try {
      const saved = localStorage.getItem('showFilters');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error reading filter state from localStorage:', error);
      return false;
    }
  }

  private saveFilterState(show: boolean): void {
    try {
      localStorage.setItem('showFilters', JSON.stringify(show));
    } catch (error) {
      console.error('Error saving filter state to localStorage:', error);
    }
  }
}
