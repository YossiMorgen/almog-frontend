import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { StudentClassesService } from '../../../../services/student-classes.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { StudentClass } from '../../../../models/studentClass';
import { StudentClassFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for student classes with additional filter fields
interface StudentClassPaginationQuery extends PaginationQuery {
  class_id?: number;
  student_id?: number;
  attendance_status?: string;
  marked_at_from?: string;
  marked_at_to?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

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
export class StudentclassesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<StudentClassFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<StudentClassFilterParams>>();

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
  
  private filterSubscription?: Subscription;

  constructor(
    private studentClassesService: StudentClassesService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('student-classes');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadStudentClasses();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<StudentClassFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'class_id';
    this.sortOrder = filters.sortOrder || 'asc';
    this.searchTerm = filters.search || '';
    
    this.loadStudentClasses();
  }

  loadStudentClasses(): void {
    this.loading = true;
    this.error = null;
    
    const query: StudentClassPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined,
      tenantId: undefined,
      class_id: this.filters.class_id || undefined,
      student_id: this.filters.student_id || undefined,
      attendance_status: this.filters.attendance_status || undefined,
      marked_at_from: this.filters.marked_at_from || undefined,
      marked_at_to: this.filters.marked_at_to || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.studentClassesService.getStudentClasses(query).subscribe({
      next: (response: any) => {
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
    this.filterChange.emit({
      ...this.filters,
      search: this.searchTerm,
      page: 1
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
      page: 1
    });
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
