import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../../services/orders.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { Order } from '../../../../models/order';
import { OrderFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for orders with additional filter fields
interface OrderPaginationQuery extends PaginationQuery {
  student_id?: number;
  status?: string;
  order_date_from?: string;
  order_date_to?: string;
  total_amount_min?: number;
  total_amount_max?: number;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

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
export class OrdersListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<OrderFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<OrderFilterParams>>();

  orders: Order[] = [];
  pagination: PaginationResult<Order>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  currentPage = 1;
  pageSize = 10;
  sortBy = 'order_date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  displayedColumns: string[] = ['order_number', 'student_id', 'order_date', 'total_amount', 'status', 'actions'];
  
  private filterSubscription?: Subscription;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('orders');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<OrderFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'order_date';
    this.sortOrder = filters.sortOrder || 'desc';
    
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    const query: OrderPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.filters.search || undefined,
      tenantId: undefined,
      student_id: this.filters.student_id || undefined,
      status: this.filters.status || undefined,
      order_date_from: this.filters.order_date_from || undefined,
      order_date_to: this.filters.order_date_to || undefined,
      total_amount_min: this.filters.total_amount_min || undefined,
      total_amount_max: this.filters.total_amount_max || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
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
