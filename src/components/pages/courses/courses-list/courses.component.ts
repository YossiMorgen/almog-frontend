import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../../services/courses.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Course } from '../../../../models/course';
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
export class CoursesComponent implements OnInit {
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
  
  displayedColumns: string[] = ['name', 'level', 'day_of_week', 'time', 'price', 'students', 'status', 'actions'];

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TODO: Get current user when auth is ready
    // this.currentUser = this.authService.getCurrentUser();
    
    // Check for season_id in query parameters
    this.route.queryParams.subscribe(params => {
      if (params['season_id']) {
        this.seasonId = parseInt(params['season_id']);
      }
      this.loadCourses();
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined,
      season_id: this.seasonId || undefined
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
    this.currentPage = 1;
    this.loadCourses();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadCourses();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCourses();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadCourses();
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
    this.seasonId = null;
    this.router.navigate(['/crm/courses'], { queryParams: {} });
  }

  signOut(): void {
    // TODO: Implement logout when auth is ready
    // this.authService.logout();
    console.log('Sign out clicked');
  }
}
