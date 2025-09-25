import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderItemsService } from '../../../../services/order-items.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { OrderItem } from '../../../../models/orderItem';
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
  selector: 'app-order-items',
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
  providers: [OrderItemsService],
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss']
})
export class OrderItemsComponent implements OnInit {
  orderItems: OrderItem[] = [];
  pagination: PaginationResult<OrderItem>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'created_at';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  displayedColumns: string[] = ['order_id', 'item_type', 'item_id', 'quantity', 'unit_price', 'total_price', 'created_at', 'actions'];

  constructor(
    private orderItemsService: OrderItemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrderItems();
  }

  loadOrderItems(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.orderItemsService.getOrderItems(query).subscribe({
      next: (response: any) => {
        console.log('Order Items API Response:', response);
        this.orderItems = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load order items';
        this.loading = false;
        console.error('Error loading order items:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadOrderItems();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadOrderItems();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrderItems();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadOrderItems();
  }

  createOrderItem(): void {
    this.router.navigate(['/crm/order-items/new']);
  }

  editOrderItem(orderItem: OrderItem): void {
    this.router.navigate(['/crm/order-items', orderItem.id, 'edit']);
  }

  viewOrderItem(orderItem: OrderItem): void {
    this.router.navigate(['/crm/order-items', orderItem.id]);
  }

  getItemTypeDisplay(itemType: string | undefined): string {
    switch (itemType) {
      case 'course': return 'Course';
      case 'product': return 'Product';
      default: return 'Unknown';
    }
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