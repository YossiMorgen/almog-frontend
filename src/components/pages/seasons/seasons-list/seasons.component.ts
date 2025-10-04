import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SeasonsService } from '../../../../services/seasons.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Season } from '../../../../models/season';
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
  selector: 'app-seasons',
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
  providers: [SeasonsService],
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit {
  seasons: Season[] = [];
  pagination: PaginationResult<Season>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['name', 'year', 'start_date', 'end_date', 'description', 'is_active', 'created_at', 'actions'];

  constructor(
    private seasonsService: SeasonsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.seasonsService.getSeasons(query).subscribe({
      next: (response: any) => {
        this.seasons = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load seasons';
        this.loading = false;
        console.error('Error loading seasons:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadSeasons();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadSeasons();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSeasons();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadSeasons();
  }

  createSeason(): void {
    this.router.navigate(['/crm/seasons/new']);
  }

  editSeason(season: Season): void {
    this.router.navigate(['/crm/seasons', season.id, 'edit']);
  }

  viewSeason(season: Season): void {
    this.router.navigate(['/crm/seasons', season.id]);
  }

  viewCourses(season: Season): void {
    this.router.navigate(['/crm/courses'], { queryParams: { season_id: season.id } });
  }

  getActiveStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'text-green-600' : 'text-gray-600';
  }

  getActiveStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
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
