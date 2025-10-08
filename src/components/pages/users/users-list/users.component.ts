import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { User } from '../../../../models/user';
import { UserFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for users with additional filter fields
interface UserPaginationQuery extends PaginationQuery {
  role?: string;
  status?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

@Component({
  selector: 'app-users',
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
  providers: [UsersService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<UserFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<UserFilterParams>>();

  users: User[] = [];
  pagination: PaginationResult<User>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  currentPage = 1;
  pageSize = 10;
  sortBy = 'email';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['email', 'name', 'createdAt', 'notes', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('users');
    
    // Watch for filter changes from route params
    this.filterSubscription = this.route.queryParams.subscribe(params => {
      // Don't call loadUsers() here - it will be called by ngOnChanges when filters change
    });
    
    // Initial load with current filters
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<UserFilterParams>): void {
    // Update component properties from filters
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'email';
    this.sortOrder = filters.sortOrder || 'asc';
    
    // Load users with new filters
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    const query: UserPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      tenantId: undefined, // Will be set by the service
      // Add user-specific filters from the filters input
      role: this.filters.role || undefined,
      status: this.filters.status || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.usersService.getUsers(query).subscribe({
      next: (response: any) => {
        this.users = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', error);
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

  getDisplayName(user: User): string {
    if (user.display_name) {
      return user.display_name;
    }
    if (user.first_name && user.last_name) {
      return user.first_name + ' ' + user.last_name;
    }
    return user.email;
  }

  createUser(): void {
    this.router.navigate(['/crm/users/new']);
  }

  editUser(user: User): void {
    this.router.navigate(['/crm/users', user.id, 'edit']);
  }

  viewUser(user: User): void {
    this.router.navigate(['/crm/users', user.id]);
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

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }
}

