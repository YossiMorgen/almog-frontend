import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../../services/products.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Product } from '../../../../models/product';
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
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  pagination: PaginationResult<Product>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['sku', 'name', 'category', 'price', 'stock_quantity', 'status', 'actions'];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      search: this.searchTerm || undefined
    };

    this.productsService.getProducts(query).subscribe({
      next: (response: any) => {
        console.log('Products API Response:', response);
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

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadProducts();
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


