import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ClassesLocation } from '../../../../models/classesLocation';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { ClassesLocationFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
import { Subscription } from 'rxjs';

// Extended query interface for classes locations with additional filter fields
interface ClassesLocationPaginationQuery extends PaginationQuery {
  city?: string;
  is_active?: boolean;
  capacity_min?: number;
  capacity_max?: number;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

@Component({
  selector: 'app-classes-locations-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule
  ],
  providers: [ClassesLocationsService],
  templateUrl: './classes-locations-list.component.html',
  styleUrls: ['./classes-locations-list.component.scss']
})
export class ClassesLocationsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<ClassesLocationFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<ClassesLocationFilterParams>>();

  locations: ClassesLocation[] = [];
  pagination: PaginationResult<ClassesLocation>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  displayedColumns: string[] = ['name', 'city', 'capacity', 'is_active', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private classesLocationsService: ClassesLocationsService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('classes-locations');
    
    // Watch for filter changes from route params
    this.filterSubscription = this.route.queryParams.subscribe(params => {
      // Don't call loadLocations() here - it will be called by ngOnChanges when filters change
    });
    
    // Initial load with current filters
    this.loadLocations();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<ClassesLocationFilterParams>): void {
    // Update component properties from filters
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'name';
    this.sortOrder = filters.sortOrder || 'asc';
    
    // Load locations with new filters
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    this.error = null;
    
    const query: ClassesLocationPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      tenantId: undefined, // Will be set by the service
      // Add classes location-specific filters from the filters input
      city: this.filters.city || undefined,
      is_active: this.filters.is_active || undefined,
      capacity_min: this.filters.capacity_min || undefined,
      capacity_max: this.filters.capacity_max || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.classesLocationsService.getClassesLocations(query).subscribe({
      next: (response: any) => {
        this.locations = response.data?.data || [];
        this.pagination = response.data?.pagination || null;
        this.loading = false;
        
        // Debug: Log loaded data
        console.log('Loaded locations:', this.locations);
        console.log('Locations count:', this.locations.length);
      },
      error: (error: any) => {
        this.error = 'Failed to load locations';
        this.loading = false;
        console.error('Error loading locations:', error);
      }
    });
  }


  onSort(field: string): void {
    let newSortOrder: 'asc' | 'desc' = 'asc';
    
    if (this.sortBy === field) {
      newSortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    this.filterChange.emit({
      ...this.filters,
      sortBy: field,
      sortOrder: newSortOrder
    });
  }

  onPageChange(page: number): void {
    this.filterChange.emit({
      ...this.filters,
      page: page
    });
  }

  onPageSizeChange(): void {
    this.filterChange.emit({
      ...this.filters,
      limit: this.pageSize,
      page: 1 // Reset to first page when changing page size
    });
  }

  createLocation(): void {
    this.router.navigate(['/crm/classes-locations/new']);
  }

  editLocation(location: ClassesLocation): void {
    this.router.navigate(['/crm/classes-locations', location.id, 'edit']);
  }

  viewLocation(location: ClassesLocation): void {
    this.router.navigate(['/crm/classes-locations', location.id]);
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const pages: number[] = [];
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.page;
    
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
