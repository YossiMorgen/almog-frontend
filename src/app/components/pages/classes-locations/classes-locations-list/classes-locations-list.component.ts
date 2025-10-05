import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { ClassesLocation } from '../../../../models/classesLocation';
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
  selector: 'app-classes-locations-list',
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
  providers: [ClassesLocationsService],
  templateUrl: './classes-locations-list.component.html',
  styleUrls: ['./classes-locations-list.component.scss']
})
export class ClassesLocationsListComponent implements OnInit {
  locations: ClassesLocation[] = [];
  pagination: PaginationResult<ClassesLocation>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['name', 'city', 'capacity', 'phone', 'email', 'status', 'actions'];

  constructor(
    private classesLocationsService: ClassesLocationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.classesLocationsService.getClassesLocations(query).subscribe({
      next: (response: any) => {
        this.locations = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load locations';
        this.loading = false;
        console.error('Error loading locations:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadLocations();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadLocations();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLocations();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadLocations();
  }

  createLocation(): void {
    this.router.navigate(['/crm/classes-locations/new']);
  }

  editLocation(location: ClassesLocation): void {
    this.router.navigate(['/crm/classes-locations', location.id, 'edit']);
  }

  viewLocation(location: ClassesLocation): void {
    this.router.navigate(['/crm/classes-locations', location.id]);
  }

  getStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
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
