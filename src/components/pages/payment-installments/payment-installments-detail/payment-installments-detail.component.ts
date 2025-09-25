import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentInstallmentsService } from '../../../../services/payment-installments.service';
import { PaymentInstallment } from '../../../../models/paymentInstallment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payment-installments-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [PaymentInstallmentsService],
  templateUrl: './payment-installments-detail.component.html',
  styleUrls: ['./payment-installments-detail.component.scss']
})
export class PaymentinstallmentsDetailComponent implements OnInit {
  paymentInstallment: PaymentInstallment | null = null;
  loading = false;
  error: string | null = null;
  installmentId: number | null = null;
  currentUser: any = null;

  constructor(
    private paymentInstallmentsService: PaymentInstallmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.installmentId = +params['id'];
        this.loadPaymentInstallment();
      }
    });
  }

  loadPaymentInstallment(): void {
    if (!this.installmentId) return;

    this.loading = true;
    this.paymentInstallmentsService.getPaymentInstallment(this.installmentId).subscribe({
      next: (response: any) => {
        this.paymentInstallment = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load payment installment';
        this.loading = false;
        console.error('Error loading payment installment:', error);
      }
    });
  }

  editPaymentInstallment(): void {
    this.router.navigate(['/crm/payment-installments', this.installmentId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/payment-installments']);
  }

  getPaymentMethodDisplay(method: string | undefined): string {
    switch (method) {
      case 'cash': return 'Cash';
      case 'check': return 'Check';
      case 'credit_card': return 'Credit Card';
      case 'debit_card': return 'Debit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'other': return 'Other';
      default: return 'Not specified';
    }
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'completed': return 'primary';
      case 'failed': return 'warn';
      case 'cancelled': return 'warn';
      case 'refunded': return 'accent';
      default: return 'primary';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
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

  formatAmount(amount: number | undefined): string {
    return amount ? `$${amount.toFixed(2)}` : 'Not specified';
  }
}