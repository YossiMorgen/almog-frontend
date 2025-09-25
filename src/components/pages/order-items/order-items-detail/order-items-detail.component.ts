import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemsService } from '../../../../services/order-items.service';
import { OrderItem } from '../../../../models/orderItem';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-items-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [OrderItemsService],
  templateUrl: './order-items-detail.component.html',
  styleUrls: ['./order-items-detail.component.scss']
})
export class OrderItemsDetailComponent implements OnInit {
  orderItem: OrderItem | null = null;
  loading = false;
  error: string | null = null;
  orderItemId: number | null = null;
  currentUser: any = null;

  constructor(
    private orderItemsService: OrderItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderItemId = +params['id'];
        this.loadOrderItem();
      }
    });
  }

  loadOrderItem(): void {
    if (!this.orderItemId) return;

    this.loading = true;
    this.orderItemsService.getOrderItem(this.orderItemId).subscribe({
      next: (response: any) => {
        this.orderItem = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load order item';
        this.loading = false;
        console.error('Error loading order item:', error);
      }
    });
  }

  editOrderItem(): void {
    this.router.navigate(['/crm/order-items', this.orderItemId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/order-items']);
  }

  getItemTypeDisplay(itemType: string | undefined): string {
    switch (itemType) {
      case 'course': return 'Course';
      case 'product': return 'Product';
      default: return 'Unknown';
    }
  }

  getItemTypeColor(itemType: string | undefined): string {
    switch (itemType) {
      case 'course': return 'primary';
      case 'product': return 'accent';
      default: return 'primary';
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

  formatPrice(price: number | undefined): string {
    return price ? `$${price.toFixed(2)}` : 'Not specified';
  }

  calculateSubtotal(): number {
    if (!this.orderItem) return 0;
    return this.orderItem.quantity * this.orderItem.unit_price;
  }

  calculateFinalTotal(): number {
    if (!this.orderItem) return 0;
    const subtotal = this.calculateSubtotal();
    return subtotal - this.orderItem.discount_amount + this.orderItem.tax_amount;
  }
}