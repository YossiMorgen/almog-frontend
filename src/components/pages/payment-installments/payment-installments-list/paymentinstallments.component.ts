import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaymentInstallmentsService } from '../../../../services/payment-installments.service';
import { PaginationQuery, PaginationResult } from '../../../../services/api.service';
import { PaymentInstallment } from '../../../../models/paymentInstallment';
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
  selector: 'app-paymentinstallments',
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
  providers: [PaymentInstallmentsService],
  templateUrl: './paymentinstallments.component.html',
  styleUrls: ['./paymentinstallments.component.scss']
})
export class PaymentinstallmentsComponent implements OnInit {
  paymentInstallments: PaymentInstallment[] = [];
  pagination: PaginationResult<PaymentInstallment>['pagination'] | null = null;
  loading = false;
  error: string | null = null;
  Math = Math;
  currentUser: any = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  sortBy = 'installment_number';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = ['installment_number', 'amount', 'payment_method', 'payment_date', 'status', 'actions'];

  constructor(
    private paymentInstallmentsService: PaymentInstallmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPaymentInstallments();
  }

  loadPaymentInstallments(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.paymentInstallmentsService.getPaymentInstallments(query).subscribe({
      next: (response: any) => {
        this.paymentInstallments = response.data.data;
        this.pagination = response.data.pagination;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load payment installments';
        this.loading = false;
        console.error('Error loading payment installments:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadPaymentInstallments();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadPaymentInstallments();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPaymentInstallments();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadPaymentInstallments();
  }

  createPaymentInstallment(): void {
    this.router.navigate(['/crm/payment-installments/new']);
  }

  editPaymentInstallment(installment: PaymentInstallment): void {
    this.router.navigate(['/crm/payment-installments', installment.id, 'edit']);
  }

  viewPaymentInstallment(installment: PaymentInstallment): void {
    this.router.navigate(['/crm/payment-installments', installment.id]);
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

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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

  formatAmount(amount: number | undefined): string {
    return amount ? `$${amount.toFixed(2)}` : 'Not specified';
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