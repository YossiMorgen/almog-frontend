import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { RolesService } from '../../../../services/roles.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Role } from '../../../../models/role';
import { RoleFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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
export class RolesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<RoleFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<RoleFilterParams>>();

  roles: Role[] = [];
  pagination: PaginationResult<Role>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['name', 'description', 'is_system', 'created_at', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private rolesService: RolesService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('roles');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<RoleFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'name';
    this.sortOrder = filters.sortOrder || 'asc';
    
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.rolesService.getRoles(query).subscribe({
      next: (response: any) => {
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


