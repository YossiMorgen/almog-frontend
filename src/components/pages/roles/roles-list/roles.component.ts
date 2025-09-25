import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RolesService } from '../../../../services/roles.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Role } from '../../../../models/role';
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
  selector: 'app-roles',
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
  providers: [RolesService],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  pagination: PaginationResult<Role>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['name', 'description', 'is_system', 'created_at', 'actions'];

  constructor(
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.rolesService.getRoles(query).subscribe({
      next: (response: any) => {
        console.log('Roles API Response:', response);
        this.roles = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load roles';
        this.loading = false;
        console.error('Error loading roles:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadRoles();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadRoles();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRoles();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadRoles();
  }

  createRole(): void {
    this.router.navigate(['/crm/roles/new']);
  }

  editRole(role: Role): void {
    this.router.navigate(['/crm/roles', role.id, 'edit']);
  }

  viewRole(role: Role): void {
    this.router.navigate(['/crm/roles', role.id]);
  }

  getSystemRoleClass(isSystem: boolean | undefined): string {
    return isSystem ? 'text-blue-600' : 'text-gray-600';
  }

  getSystemRoleText(isSystem: boolean | undefined): string {
    return isSystem ? 'System' : 'Custom';
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


