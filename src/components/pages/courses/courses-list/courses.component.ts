import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../../services/courses.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Course } from '../../../../models/course';
import { CourseFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for courses with additional filter fields
interface CoursePaginationQuery extends PaginationQuery {
  status?: string;
  level?: string;
  day_of_week?: string;
  time?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

@Component({
  selector: 'app-courses',
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
  providers: [CoursesService],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<TableFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<TableFilterParams>>();

  courses: Course[] = [];
  pagination: PaginationResult<Course>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  seasonId: number | null = null;
  
  displayedColumns: string[] = ['name', 'level', 'day_of_week', 'time', 'price', 'students', 'description', 'status', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('courses');
    
    // Watch for filter changes from the wrapper
    this.filterSubscription = this.route.queryParams.subscribe(params => {
      if (params['season_id']) {
        this.seasonId = parseInt(params['season_id']);
      }
      this.loadCourses();
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<TableFilterParams>): void {
    // Update component properties from filters
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'name';
    this.sortOrder = filters.sortOrder || 'asc';
    this.searchTerm = filters.search || '';
    
    // Handle course-specific filters
    if (filters.season_id) {
      this.seasonId = filters.season_id;
    }
    
    // Load courses with new filters
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.error = null;
    
    const query: CoursePaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined,
      season_id: this.seasonId || undefined,
      tenantId: undefined, // Will be set by the service
      // Add course-specific filters from the filters input
      status: this.filters.status || undefined,
      level: this.filters.level || undefined,
      day_of_week: this.filters.day_of_week || undefined,
      time: this.filters.time || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.coursesService.getCourses(query).subscribe({
      next: (response: any) => {
        this.courses = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load courses';
        this.loading = false;
        console.error('Error loading courses:', error);
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

  createCourse(): void {
    const queryParams = this.seasonId ? { season_id: this.seasonId } : {};
    this.router.navigate(['/crm/courses/new'], { queryParams });
  }

  editCourse(course: Course): void {
    this.router.navigate(['/crm/courses', course.id, 'edit']);
  }

  viewCourse(course: Course): void {
    this.router.navigate(['/crm/courses', course.id]);
  }

  getLevelDisplay(level: string | undefined): string {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'expert': return 'Expert';
      default: return 'Not specified';
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'full': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'draft': return 'Draft';
      case 'open': return 'Open';
      case 'full': return 'Full';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getDayDisplay(day: string | undefined): string {
    return day || 'Not specified';
  }

  getTimeDisplay(time: string | undefined): string {
    return time || 'Not specified';
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

  clearSeasonFilter(): void {
    this.filterChange.emit({
      ...this.filters,
      season_id: undefined
    });
  }

}
