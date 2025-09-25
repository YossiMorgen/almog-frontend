import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourseEnrollmentsService } from '../../../../services/course-enrollments.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { CourseEnrollment } from '../../../../models/courseEnrollment';
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
export class CourseenrollmentsComponent implements OnInit {
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

  constructor(
    private courseEnrollmentsService: CourseEnrollmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
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
    this.currentPage = 1;
    this.loadEnrollments();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadEnrollments();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEnrollments();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadEnrollments();
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

