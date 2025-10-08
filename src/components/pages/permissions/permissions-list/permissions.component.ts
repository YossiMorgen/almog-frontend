import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PermissionsService } from '../../../../services/permissions.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Permission } from '../../../../models/permission';
import { PermissionFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for permissions with additional filter fields
interface PermissionPaginationQuery extends PaginationQuery {
  module?: string;
  action?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
  role_id?: number;
}

@Component({
  selector: 'app-permissions',
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
  providers: [PermissionsService],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<PermissionFilterParams> = {};
  @Input() roleId?: number | null;
  @Output() filterChange = new EventEmitter<Partial<PermissionFilterParams>>();

  permissions: Permission[] = [];
  pagination: PaginationResult<Permission>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['name', 'module', 'action', 'description', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private permissionsService: PermissionsService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('permissions');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadPermissions();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<PermissionFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'name';
    this.sortOrder = filters.sortOrder || 'asc';
    
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading = true;
    this.error = null;
    
    const query: PermissionPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      tenantId: undefined,
      module: this.filters.module || undefined,
      action: this.filters.action || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined,
      role_id: this.roleId || undefined
    };

    this.permissionsService.getPermissions(query).subscribe({
      next: (response: any) => {
        this.permissions = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load permissions';
        this.loading = false;
        console.error('Error loading permissions:', error);
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
      page: 1
    });
  }

  createPermission(): void {
    this.router.navigate(['/crm/permissions/new']);
  }

  editPermission(permission: Permission): void {
    this.router.navigate(['/crm/permissions', permission.id, 'edit']);
  }

  viewPermission(permission: Permission): void {
    this.router.navigate(['/crm/permissions', permission.id]);
  }

  getModuleDisplay(module: string | undefined): string {
    return module || 'Not specified';
  }

  getActionDisplay(action: string | undefined): string {
    return action || 'Not specified';
  }

  getDescriptionDisplay(description: string | undefined): string {
    if (!description) return 'No description';
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
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

