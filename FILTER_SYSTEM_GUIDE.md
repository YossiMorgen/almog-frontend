# Table Filter System

This document explains how to use the table filter system implemented in the Angular application.

## Overview

The filter system provides:
- **Zod schema validation** for filter parameters
- **Reusable filter component** that converts values to forms and updates URL params
- **URL parameter integration** for bookmarkable filtered views
- **Type-safe filter definitions** for different entity types

## Components

### 1. Filter Schemas (`src/models/filter-schemas.ts`)

Defines Zod schemas for different entity types:

```typescript
// Base filter schema with common fields
export const TableFilterSchema = z.object({
  search: z.string().optional().nullable(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  // ... more fields
});

// Entity-specific schemas
export const CourseFilterSchema = TableFilterSchema.extend({
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().nullable(),
  status: z.enum(['draft', 'open', 'full', 'in_progress', 'completed', 'cancelled']).optional().nullable(),
  // ... more course-specific fields
});
```

### 2. Filter Component (`src/components/shared/table-filter/`)

A reusable component that:
- Renders filter forms based on configuration
- Updates URL parameters automatically
- Shows active filters as chips
- Provides reset functionality

### 3. Filter Service (`src/services/filter.service.ts`)

Manages filter state globally:
- Controls filter visibility
- Tracks current filter type
- Manages filter parameters

## Usage

### 1. In List Components

```typescript
import { FilterService } from '../../../../services/filter.service';
import { CourseFilterParams } from '../../../../models/filter-schemas';

export class CoursesComponent implements OnInit, OnDestroy {
  constructor(
    private filterService: FilterService,
    // ... other services
  ) {}

  ngOnInit(): void {
    // Set the filter type for this component
    this.filterService.setFilterType('courses');
    
    // Subscribe to filter changes
    this.route.queryParams.subscribe(params => {
      this.loadCourses();
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }
}
```

### 2. Filter Configuration

Define filter fields in `FILTER_CONFIGS`:

```typescript
export const FILTER_CONFIGS: Record<string, FilterField[]> = {
  courses: [
    { key: 'search', label: 'Search', type: 'text', placeholder: 'Search courses...' },
    { key: 'level', label: 'Level', type: 'select', options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      // ...
    ]},
    { key: 'price_min', label: 'Min Price', type: 'number', min: 0, step: 0.01 },
    // ... more fields
  ],
};
```

### 3. URL Parameters

The system automatically handles URL parameters:

```
/crm/courses?search=swimming&level=beginner&status=open&page=2
```

### 4. Header Integration

The header includes a filter toggle button that shows/hides the filter component globally.

## Filter Field Types

- **text**: Text input field
- **number**: Number input with min/max/step validation
- **select**: Dropdown with predefined options
- **date**: Date picker
- **dateRange**: Date range picker (future enhancement)
- **multiselect**: Multiple selection (future enhancement)
- **boolean**: Toggle switch

## Adding New Filter Types

1. **Create Zod Schema**:
```typescript
export const NewEntityFilterSchema = TableFilterSchema.extend({
  customField: z.string().optional().nullable(),
});
```

2. **Add Filter Configuration**:
```typescript
export const FILTER_CONFIGS: Record<string, FilterField[]> = {
  // ... existing configs
  newEntity: [
    { key: 'customField', label: 'Custom Field', type: 'text' },
    // ... more fields
  ],
};
```

3. **Use in Component**:
```typescript
ngOnInit(): void {
  this.filterService.setFilterType('newEntity');
}
```

## Features

- ✅ **Type Safety**: Zod schemas ensure type safety
- ✅ **URL Integration**: Filters are reflected in URL parameters
- ✅ **Reusable**: Single component for all entity types
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation
- ✅ **Internationalized**: All text is translatable
- ✅ **Auto-apply**: Filters apply automatically as user types
- ✅ **Manual Apply**: Option to disable auto-apply for complex filters

## Future Enhancements

- Date range picker
- Multi-select dropdowns
- Advanced filter combinations
- Saved filter presets
- Filter export/import
- Real-time filter suggestions
