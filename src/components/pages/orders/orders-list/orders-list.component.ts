import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../../../services/orders.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Order } from '../../../../models/order';
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
  selector: 'app-orders-list',
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
  providers: [OrdersService],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  pagination: PaginationResult<Order>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'order_date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  displayedColumns: string[] = ['order_number', 'student_id', 'order_date', 'total_amount', 'status', 'actions'];

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.ordersService.getOrders(query).subscribe({
      next: (response: any) => {
        this.orders = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  createOrder(): void {
    this.router.navigate(['/crm/orders/new']);
  }

  editOrder(order: Order): void {
    this.router.navigate(['/crm/orders', order.id, 'edit']);
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/crm/orders', order.id]);
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      case 'refunded': return 'Refunded';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'pending': return 'accent';
      case 'cancelled': return 'warn';
      case 'refunded': return 'primary';
      default: return 'accent';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return `$${amount.toFixed(2)}`;
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
