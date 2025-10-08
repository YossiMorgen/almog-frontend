import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { OrderItemsService } from '../../../../services/order-items.service';
import { FilterService } from '../../../../services/filter.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { OrderItem } from '../../../../models/orderItem';
import { OrderItemFilterParams, TableFilterParams } from '../../../../models/filter-schemas';
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

// Extended query interface for order items with additional filter fields
interface OrderItemPaginationQuery extends PaginationQuery {
  order_id?: number;
  item_type?: string;
  item_id?: number;
  quantity_min?: number;
  quantity_max?: number;
  unit_price_min?: number;
  unit_price_max?: number;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

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
export class OrderItemsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Partial<OrderItemFilterParams> = {};
  @Output() filterChange = new EventEmitter<Partial<OrderItemFilterParams>>();

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
  
  private filterSubscription?: Subscription;

  constructor(
    private orderItemsService: OrderItemsService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.setFilterType('order-items');
    
    this.filterSubscription = this.route.queryParams.subscribe(params => {
    });
    
    this.loadOrderItems();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters(this.filters);
    }
  }

  private applyFilters(filters: Partial<OrderItemFilterParams>): void {
    this.currentPage = filters.page || 1;
    this.pageSize = filters.limit || 10;
    this.sortBy = filters.sortBy || 'created_at';
    this.sortOrder = filters.sortOrder || 'desc';
    this.searchTerm = filters.search || '';
    
    this.loadOrderItems();
  }

  loadOrderItems(): void {
    this.loading = true;
    this.error = null;
    
    const query: OrderItemPaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined,
      tenantId: undefined,
      order_id: this.filters.order_id || undefined,
      item_type: this.filters.item_type || undefined,
      item_id: this.filters.item_id || undefined,
      quantity_min: this.filters.quantity_min || undefined,
      quantity_max: this.filters.quantity_max || undefined,
      unit_price_min: this.filters.unit_price_min || undefined,
      unit_price_max: this.filters.unit_price_max || undefined,
      created_from: this.filters.created_from || undefined,
      created_to: this.filters.created_to || undefined,
      updated_from: this.filters.updated_from || undefined,
      updated_to: this.filters.updated_to || undefined
    };

    this.orderItemsService.getOrderItems(query).subscribe({
      next: (response: any) => {
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