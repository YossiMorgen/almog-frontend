import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../../../services/payments.service';
import { Payment } from '../../../../models/payment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payments-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [PaymentsService],
  templateUrl: './payments-detail.component.html',
  styleUrls: ['./payments-detail.component.scss']
})
export class PaymentsDetailComponent implements OnInit {
  payment: Payment | null = null;
  loading = false;
  error: string | null = null;
  paymentId: number | null = null;
  currentUser: any = null;

  constructor(
    private paymentsService: PaymentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.paymentId = +params['id'];
        this.loadPayment();
      }
    });
  }

  loadPayment(): void {
    if (!this.paymentId) return;

    this.loading = true;
    this.paymentsService.getPayment(this.paymentId).subscribe({
      next: (response: any) => {
        this.payment = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load payment';
        this.loading = false;
        console.error('Error loading payment:', error);
      }
    });
  }

  editPayment(): void {
    this.router.navigate(['/crm/payments', this.paymentId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/payments']);
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'partial': return 'accent';
      case 'pending': return 'warn';
      case 'overdue': return 'warn';
      case 'cancelled': return '';
      case 'refunded': return 'accent';
      default: return 'primary';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'partial': return 'Partial';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      case 'cancelled': return 'Cancelled';
      case 'refunded': return 'Refunded';
      default: return 'Unknown';
    }
  }

  formatCurrency(amount: number | undefined): string {
    return amount ? `$${amount.toFixed(2)}` : '$0.00';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }

  getRemainingAmount(): number {
    if (!this.payment) return 0;
    return (this.payment.total_amount || 0) - (this.payment.paid_amount || 0);
  }

  getPaymentProgress(): number {
    if (!this.payment || !this.payment.total_amount) return 0;
    return ((this.payment.paid_amount || 0) / this.payment.total_amount) * 100;
  }
}