import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ClassesService } from '../../../../services/classes.service';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';
import { UsersService } from '../../../../services/users.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Class } from '../../../../models/class';
import { ClassesLocation } from '../../../../models/classesLocation';
import { User } from '../../../../models/user';
import { ClassFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

// Extended query interface for classes with additional filter fields
interface ClassPaginationQuery extends PaginationQuery {
  status?: string;
  instructor_id?: number;
  location_id?: number;
  course_id?: number;
  class_date_from?: string;
  class_date_to?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  providers: [ClassesService, ClassesLocationsService, UsersService],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<ClassFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<ClassFilterParams>>();

  classes: Class[] = [];
  locations: ClassesLocation[] = [];
  instructors: User[] = [];
  pagination: PaginationResult<Class>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'class_date';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['class_number', 'course_id', 'class_date', 'time', 'location_id', 'instructor_id', 'status', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private classesService: ClassesService,
    private classesLocationsService: ClassesLocationsService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('classes');
    
    // Watch for filter changes from route params
    this.filterSubscription = this.route.queryParams.subscribe(params => {
      // Don't call loadClasses() here - it will be called by ngOnChanges when filters change
    });
    
    // Load supporting data
    this.loadLocations();
    this.loadInstructors();
    
    // Initial load with current filters
    this.loadClasses();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<ClassFilterParams>): void {
    // Update component properties from filters
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'class_date';
    this.sortOrder = filters.sortOrder || 'asc';
    this.searchTerm = filters.search || '';
    
    // Load classes with new filters
    this.loadClasses();
  }

  loadLocations(): void {
    this.classesLocationsService.getClassesLocations().subscribe({
      next: (response: any) => {
        this.locations = response.data?.data || [];
      },
      error: (error: any) => {
        console.error('Error loading locations:', error);
        this.locations = [];
      }
    });
  }

  loadInstructors(): void {
    this.usersService.getInstructors().subscribe({
      next: (response: any) => {
        this.instructors = response.data?.data || [];
      },
      error: (error: any) => {
        console.error('Error loading instructors:', error);
        this.instructors = [];
      }
    });
  }

  loadClasses(): void {
    this.loading = true;
    this.error = null;
    
    const query: ClassPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined,
      tenantId: undefined, // Will be set by the service
      // Add class-specific filters from the filters input
      status: this.filters.status || undefined,
      instructor_id: this.filters.instructor_id || undefined,
      location_id: this.filters.location_id || undefined,
      course_id: this.filters.course_id || undefined,
      class_date_from: this.filters.class_date_from || undefined,
      class_date_to: this.filters.class_date_to || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.classesService.getClasses(query).subscribe({
      next: (response: any) => {
        this.classes = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load classes';
        this.loading = false;
        console.error('Error loading classes:', error);
      }
    });
  }

  onSearch(): void {
    this.filterChange.emit({
      ...this.filters,
      search: this.searchTerm,
      page: 1 // Reset to first page when searching
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

  createClass(): void {
    this.router.navigate(['/crm/classes/new']);
  }

  editClass(classData: Class): void {
    this.router.navigate(['/crm/classes', classData.id, 'edit']);
  }

  viewClass(classData: Class): void {
    this.router.navigate(['/crm/classes', classData.id]);
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'postponed': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'postponed': return 'Postponed';
      default: return 'Unknown';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatTime(time: string | undefined): string {
    return time || 'Not specified';
  }

  getInstructorName(instructorId: number | undefined): string {
    if (!instructorId) return 'Not assigned';
    const instructor = this.instructors.find(i => i.id === instructorId);
    return instructor ? (instructor.first_name + ' ' + instructor.last_name || instructor.email) : `Instructor ID: ${instructorId}`;
  }

  getLocationName(locationId: number | undefined): string {
    if (!locationId) return 'Not specified';
    const location = this.locations.find(l => l.id === locationId);
    return location ? location.name : `Location ID: ${locationId}`;
  }
}
