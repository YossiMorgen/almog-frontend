import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CourseEnrollmentsService } from '../../../../services/course-enrollments.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { CourseEnrollment } from '../../../../models/courseEnrollment';
import { CourseEnrollmentFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for course enrollments with additional filter fields
interface CourseEnrollmentPaginationQuery extends PaginationQuery {
  status?: string;
  student_id?: number;
  course_id?: number;
  enrollment_date_from?: string;
  enrollment_date_to?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

@Component({
  selector: 'app-courseenrollments',
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
  providers: [CourseEnrollmentsService],
  templateUrl: './courseenrollments.component.html',
  styleUrls: ['./courseenrollments.component.scss']
})
export class CourseenrollmentsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<CourseEnrollmentFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<CourseEnrollmentFilterParams>>();

  enrollments: CourseEnrollment[] = [];
  pagination: PaginationResult<CourseEnrollment>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'enrollment_date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  displayedColumns: string[] = ['student_name', 'course_name', 'enrollment_date', 'status', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private courseEnrollmentsService: CourseEnrollmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('course-enrollments');
    
    // Watch for filter changes from route params
    this.filterSubscription = this.route.queryParams.subscribe(params => {
      // Don't call loadEnrollments() here - it will be called by ngOnChanges when filters change
    });
    
    // Initial load with current filters
    this.loadEnrollments();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<CourseEnrollmentFilterParams>): void {
    // Update component properties from filters
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'enrollment_date';
    this.sortOrder = filters.sortOrder || 'desc';
    this.searchTerm = filters.search || '';
    
    // Load enrollments with new filters
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading = true;
    this.error = null;
    
    const query: CourseEnrollmentPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined,
      tenantId: undefined, // Will be set by the service
      // Add course enrollment-specific filters from the filters input
      status: this.filters.status || undefined,
      student_id: this.filters.student_id || undefined,
      course_id: this.filters.course_id || undefined,
      enrollment_date_from: this.filters.enrollment_date_from || undefined,
      enrollment_date_to: this.filters.enrollment_date_to || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.courseEnrollmentsService.getCourseEnrollments(query).subscribe({
      next: (response: any) => {
        this.enrollments = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load course enrollments';
        this.loading = false;
        console.error('Error loading course enrollments:', error);
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

  createEnrollment(): void {
    this.router.navigate(['/crm/course-enrollments/new']);
  }

  editEnrollment(enrollment: CourseEnrollment): void {
    this.router.navigate(['/crm/course-enrollments', enrollment.id, 'edit']);
  }

  viewEnrollment(enrollment: CourseEnrollment): void {
    this.router.navigate(['/crm/course-enrollments', enrollment.id]);
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'enrolled': return 'Enrolled';
      case 'waitlisted': return 'Waitlisted';
      case 'dropped': return 'Dropped';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'enrolled': return 'text-green-600 bg-green-100';
      case 'waitlisted': return 'text-yellow-600 bg-yellow-100';
      case 'dropped': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const pages: number[] = [];
    const totalPages = this.pagination.totalPages;
    const currentPage = this.currentPage;
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}

