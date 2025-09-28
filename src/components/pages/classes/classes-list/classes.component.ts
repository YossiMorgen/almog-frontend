import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClassesService } from '../../../../services/classes.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Class } from '../../../../models/class';
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
  providers: [ClassesService],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  classes: Class[] = [];
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
  
  displayedColumns: string[] = ['class_number', 'course_id', 'class_date', 'time', 'location', 'instructor_id', 'status', 'actions'];

  constructor(
    private classesService: ClassesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TODO: Get current user when auth is ready
    // this.currentUser = this.authService.getCurrentUser();
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
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
    this.currentPage = 1;
    this.loadClasses();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadClasses();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClasses();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadClasses();
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
