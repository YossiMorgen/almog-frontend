import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentsService } from '../../../../services/students.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Student } from '../../../../models/student';
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
  selector: 'app-students',
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
  providers: [StudentsService],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  pagination: PaginationResult<Student>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'first_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['student_code', 'name', 'email', 'phone', 'parent_name', 'status', 'actions'];

  constructor(
    private studentsService: StudentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TODO: Get current user when auth is ready
    // this.currentUser = this.authService.getCurrentUser();
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.studentsService.getStudents(query).subscribe({
      next: (response: any) => {
        this.students = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load students';
        this.loading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  createStudent(): void {
    this.router.navigate(['/crm/students/new']);
  }

  editStudent(student: Student): void {
    this.router.navigate(['/crm/students', student.id, 'edit']);
  }

  viewStudent(student: Student): void {
    this.router.navigate(['/crm/students', student.id]);
  }

  getGenderDisplay(gender: string | undefined): string {
    switch (gender) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'other': return 'Other';
      default: return 'Not specified';
    }
  }

  getStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'text-green-600' : 'text-red-600';
  }

  getStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
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
