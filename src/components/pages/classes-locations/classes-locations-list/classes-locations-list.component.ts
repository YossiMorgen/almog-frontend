import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ClassesLocation } from '../../../../models/classesLocation';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';

@Component({
  selector: 'app-classes-locations-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './classes-locations-list.component.html',
  styleUrls: ['./classes-locations-list.component.scss']
})
export class ClassesLocationsListComponent implements OnInit {
  locations: ClassesLocation[] = [];
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  };
  loading = false;
  error: string | null = null;
  searchTerm = '';
  currentPage = 0;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  displayedColumns: string[] = ['name', 'city', 'capacity', 'is_active', 'actions'];

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

    const params = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.classesLocationsService.getClassesLocations(params).subscribe({
      next: (response: any) => {
        this.locations = response.data?.data || [];
        this.pagination = {
          page: response.data?.page || 1,
          limit: response.data?.limit || 10,
          total: response.data?.total || 0,
          totalPages: response.data?.totalPages || 0
        };
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
    this.currentPage = 0;
    this.loadLocations();
  }

  onSort(sort: Sort): void {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction as 'asc' | 'desc';
    this.loadLocations();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLocations();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.currentPage = 0;
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

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.page;
    
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
