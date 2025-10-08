import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../../services/products.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Product } from '../../../../models/product';
import { ProductFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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
  selector: 'app-products',
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
  providers: [ProductsService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<ProductFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<ProductFilterParams>>();

  products: Product[] = [];
  pagination: PaginationResult<Product>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['sku', 'name', 'category', 'price', 'stock_quantity', 'status', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('products');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<ProductFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'name';
    this.sortOrder = filters.sortOrder || 'asc';
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.filters.search || undefined
    };

    this.productsService.getProducts(query).subscribe({
      next: (response: any) => {
        this.products = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error loading products:', error);
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

  createProduct(): void {
    this.router.navigate(['/crm/products/new']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/crm/products', product.id, 'edit']);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/crm/products', product.id]);
  }

  getStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '-';
    return `$${price.toFixed(2)}`;
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


