import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../../../services/orders.service';
import { Order } from '../../../../models/order';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-orders-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [OrdersService],
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  error: string | null = null;
  orderId: number | null = null;
  currentUser: any = null;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadOrder();
      }
    });
  }

  loadOrder(): void {
    if (!this.orderId) return;

    this.loading = true;
    this.ordersService.getOrder(this.orderId).subscribe({
      next: (response: any) => {
        this.order = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load order';
        this.loading = false;
        console.error('Error loading order:', error);
      }
    });
  }

  editOrder(): void {
    this.router.navigate(['/crm/orders', this.orderId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/orders']);
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

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      case 'refunded': return 'Refunded';
      default: return 'Unknown';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return `$${amount.toFixed(2)}`;
  }

  getOrderSummary(): { label: string; value: string; color?: string }[] {
    if (!this.order) return [];
    
    return [
      { label: 'Order Number', value: this.order.order_number || '-' },
      { label: 'Student ID', value: this.order.student_id.toString() },
      { label: 'Order Date', value: this.formatDate(this.order.order_date) },
      { label: 'Status', value: this.getStatusText(this.order.status), color: this.getStatusColor(this.order.status) }
    ];
  }

  getFinancialSummary(): { label: string; value: string }[] {
    if (!this.order) return [];
    
    return [
      { label: 'Subtotal', value: this.formatCurrency(this.order.subtotal) },
      { label: 'Tax Amount', value: this.formatCurrency(this.order.tax_amount) },
      { label: 'Discount Amount', value: this.formatCurrency(this.order.discount_amount) },
      { label: 'Total Amount', value: this.formatCurrency(this.order.total_amount) }
    ];
  }

  getSystemInfo(): { label: string; value: string }[] {
    if (!this.order) return [];
    
    return [
      { label: 'Created At', value: this.formatDateTime(this.order.created_at) },
      { label: 'Last Updated', value: this.formatDateTime(this.order.updated_at) },
      { label: 'Created By', value: this.order.created_by?.toString() || 'System' }
    ];
  }
}

