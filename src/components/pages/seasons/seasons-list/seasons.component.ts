import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SeasonsService } from '../../../../services/seasons.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Season } from '../../../../models/season';
import { SeasonFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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
export class SeasonsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<SeasonFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<SeasonFilterParams>>();

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
  
  private filterSubscription?: Subscription;

  constructor(
    private seasonsService: SeasonsService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('seasons');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadSeasons();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<SeasonFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'name';
    this.sortOrder = filters.sortOrder || 'asc';
    this.searchTerm = filters.search || '';
    
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
