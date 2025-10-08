# Dynamic Filter System Documentation

## Overview

The dynamic filter system has been refactored to use a service-based approach that allows for dynamic data fetching (e.g., instructor lists, course lists, etc.) instead of static configurations. This makes the filter system much more flexible and maintainable.

## Key Components

### 1. FilterConfigService (`src/services/filter-config.service.ts`)

This is the main service that provides dynamic filter configurations for each route. It includes:

- **Static configurations**: Default filters for each route
- **Dynamic filter definitions**: Configurations for filters that need to fetch data from APIs
- **Data fetching methods**: Methods that return Observable data for dropdown options

#### Key Methods:

```typescript
// Get configuration for a specific route
getRouteConfig(routePath: string): RouteFilterConfig | null

// Get dynamic filters for a route
getDynamicFiltersForRoute(routePath: string): DynamicFilterConfig[]

// Get filter options for a specific dynamic filter
getFilterOptions(routePath: string, filterKey: string): Observable<FilterOption[]>
```

#### Example Configuration:

```typescript
'students': {
  filterType: 'students',
  defaultFilters: {
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    status: 'active'
  },
  dynamicFilters: [
    {
      key: 'instructor_id',
      type: 'select',
      label: 'Instructor',
      placeholder: 'Select instructor',
      options: this.getInstructors.bind(this) // Returns Observable<FilterOption[]>
    },
    {
      key: 'course_id',
      type: 'select',
      label: 'Course',
      placeholder: 'Select course',
      options: this.getCourses.bind(this)
    }
  ]
}
```

### 2. RouteFilterService (`src/services/route-filter.service.ts`)

Updated to work with the new dynamic configuration system. It now provides:

- Current route filters
- Current route configuration
- Current dynamic filters
- Methods to get filter options

#### Key Methods:

```typescript
// Get current dynamic filters
getCurrentDynamicFilters(): DynamicFilterConfig[]

// Get filter options for a specific filter
getFilterOptions(filterKey: string): Observable<any[]>
```

### 3. Updated Route Configuration (`src/core/app.routes.ts`)

Routes now use a simplified data structure:

```typescript
data: getRouteDataWithFilters('students', requirePermissions([PERMISSIONS.STUDENTS.READ]))
```

The `filterConfigKey` is used by components to get the appropriate filter configuration from the service.

## Usage Examples

### 1. Basic Component Integration

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteFilterService } from '../../services/route-filter.service';
import { DynamicFilterConfig, FilterOption } from '../../services/filter-config.service';

@Component({
  selector: 'app-example',
  template: `
    <div *ngFor="let filter of dynamicFilters$ | async">
      <label>{{ filter.label }}:</label>
      <select 
        [value]="getFilterValue(filter.key)"
        (change)="updateFilter(filter.key, $event.target.value)">
        <option value="">{{ filter.placeholder }}</option>
        <option 
          *ngFor="let option of getFilterOptions(filter.key) | async" 
          [value]="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  dynamicFilters$: Observable<DynamicFilterConfig[]> = 
    this.routeFilterService.currentDynamicFilters$;

  constructor(private routeFilterService: RouteFilterService) {}

  ngOnInit(): void {
    // Component initialization
  }

  getFilterValue(filterKey: string): any {
    const filters = this.routeFilterService.getCurrentRouteFilters();
    return filters[filterKey as keyof TableFilterParams] || '';
  }

  getFilterOptions(filterKey: string): Observable<FilterOption[]> {
    return this.routeFilterService.getFilterOptions(filterKey);
  }

  updateFilter(filterKey: string, value: any): void {
    const currentFilters = this.routeFilterService.getCurrentRouteFilters();
    const updatedFilters = {
      ...currentFilters,
      [filterKey]: value || undefined
    };
    
    this.routeFilterService.updateFilters(updatedFilters);
  }
}
```

### 2. Adding New Dynamic Filters

To add a new dynamic filter to an existing route:

1. **Update FilterConfigService**:

```typescript
// In the route configuration
dynamicFilters: [
  {
    key: 'new_filter',
    type: 'select',
    label: 'New Filter',
    placeholder: 'Select option',
    options: this.getNewFilterOptions.bind(this)
  }
]

// Add the data fetching method
private getNewFilterOptions(): Observable<FilterOption[]> {
  // Call your API service here
  return this.yourApiService.getOptions().pipe(
    map(options => options.map(option => ({
      value: option.id,
      label: option.name
    })))
  );
}
```

2. **Update your API service** to provide the data
3. **Update your component** to handle the new filter

### 3. Creating Custom Filter Types

You can extend the system with custom filter types:

```typescript
// In FilterConfigService
dynamicFilters: [
  {
    key: 'custom_filter',
    type: 'multiselect', // Custom type
    label: 'Custom Filter',
    multiple: true,
    options: this.getCustomOptions.bind(this)
  }
]
```

Then handle the custom type in your component template:

```html
<div *ngIf="filter.type === 'multiselect'">
  <!-- Custom multiselect implementation -->
</div>
```

## Migration Guide

### From Static to Dynamic Configuration

**Before:**
```typescript
// In route configuration
data: { 
  permissions: requirePermissions([PERMISSIONS.STUDENTS.READ]),
  defaultFilters: DEFAULT_ROUTE_FILTERS['students'].defaultFilters,
  filterType: DEFAULT_ROUTE_FILTERS['students'].filterType
}
```

**After:**
```typescript
// In route configuration
data: getRouteDataWithFilters('students', requirePermissions([PERMISSIONS.STUDENTS.READ]))

// In component
constructor(
  private routeFilterService: RouteFilterService,
  private filterConfigService: FilterConfigService
) {}

ngOnInit(): void {
  // Get dynamic filters
  this.dynamicFilters$ = this.routeFilterService.currentDynamicFilters$;
  
  // Get filter options
  this.instructorOptions$ = this.routeFilterService.getFilterOptions('instructor_id');
}
```

## Benefits

1. **Dynamic Data**: Filter options can be fetched from APIs in real-time
2. **Maintainable**: All filter configurations are centralized in one service
3. **Flexible**: Easy to add new filter types and configurations
4. **Type Safe**: Full TypeScript support with proper interfaces
5. **Reusable**: Filter configurations can be shared across components
6. **Testable**: Services can be easily mocked for testing

## API Integration

To integrate with your existing API services:

1. **Update FilterConfigService methods** to call your actual API services
2. **Handle loading states** in your components
3. **Add error handling** for failed API calls
4. **Implement caching** if needed for performance

Example with real API integration:

```typescript
private getInstructors(): Observable<FilterOption[]> {
  return this.instructorService.getAll().pipe(
    map(instructors => instructors.map(instructor => ({
      value: instructor.id,
      label: `${instructor.firstName} ${instructor.lastName}`
    }))),
    catchError(error => {
      console.error('Failed to load instructors:', error);
      return of([]);
    })
  );
}
```

This new system provides a much more flexible and maintainable approach to handling dynamic filters in your application.
