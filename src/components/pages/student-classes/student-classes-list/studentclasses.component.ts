import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentClassesService } from '../../../../services/student-classes.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { StudentClass } from '../../../../models/studentClass';
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
  selector: 'app-studentclasses',
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
  providers: [StudentClassesService],
  templateUrl: './studentclasses.component.html',
  styleUrls: ['./studentclasses.component.scss']
})
export class StudentclassesComponent implements OnInit {
  studentClasses: StudentClass[] = [];
  pagination: PaginationResult<StudentClass>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'class_id';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['class_id', 'student_id', 'attendance_status', 'marked_at', 'notes', 'actions'];

  constructor(
    private studentClassesService: StudentClassesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentClasses();
  }

  loadStudentClasses(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.studentClassesService.getStudentClasses(query).subscribe({
      next: (response: any) => {
        console.log('Student Classes API Response:', response);
        this.studentClasses = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load student classes';
        this.loading = false;
        console.error('Error loading student classes:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadStudentClasses();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadStudentClasses();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudentClasses();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadStudentClasses();
  }

  createStudentClass(): void {
    this.router.navigate(['/crm/student-classes/new']);
  }

  editStudentClass(studentClass: StudentClass): void {
    this.router.navigate(['/crm/student-classes', studentClass.id, 'edit']);
  }

  viewStudentClass(studentClass: StudentClass): void {
    this.router.navigate(['/crm/student-classes', studentClass.id]);
  }

  getAttendanceStatusDisplay(status: string | undefined): string {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      default: return 'Not specified';
    }
  }

  getAttendanceStatusColor(status: string | undefined): string {
    switch (status) {
      case 'present': return 'primary';
      case 'absent': return 'warn';
      case 'late': return 'accent';
      case 'excused': return 'primary';
      default: return 'primary';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
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
