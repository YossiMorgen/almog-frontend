import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PermissionsService } from '../../../../services/permissions.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Permission } from '../../../../models/permission';
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
export class PermissionsComponent implements OnInit {
  permissions: Permission[] = [];
  pagination: PaginationResult<Permission>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['name', 'module', 'action', 'description', 'actions'];

  constructor(
    private permissionsService: PermissionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
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

  onSearch(): void {
    this.currentPage = 1;
    this.loadPermissions();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadPermissions();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPermissions();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadPermissions();
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

