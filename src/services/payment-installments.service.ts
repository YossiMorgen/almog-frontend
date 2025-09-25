import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { PaymentInstallment, CreatePaymentInstallment, UpdatePaymentInstallment } from '../models/paymentInstallment';

@Injectable({
  providedIn: 'root'
})
export class PaymentInstallmentsService {
  constructor(private apiService: ApiService) {}

  getPaymentInstallments(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<PaymentInstallment>>> {
    return this.apiService.getPaymentInstallments(query);
  }

  getPaymentInstallment(id: number): Observable<ApiResponse<PaymentInstallment>> {
    return this.apiService.getPaymentInstallment(id);
  }

  createPaymentInstallment(installment: CreatePaymentInstallment): Observable<ApiResponse<PaymentInstallment>> {
    return this.apiService.createPaymentInstallment(installment);
  }

  updatePaymentInstallment(id: number, installment: UpdatePaymentInstallment): Observable<ApiResponse<PaymentInstallment>> {
    return this.apiService.updatePaymentInstallment(id, installment);
  }

  async getPaymentInstallmentsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<PaymentInstallment>>> {
    return this.apiService.getPaymentInstallments(query).toPromise() as Promise<ApiResponse<PaginationResult<PaymentInstallment>>>;
  }

  async getPaymentInstallmentAsync(id: number): Promise<ApiResponse<PaymentInstallment>> {
    return this.apiService.getPaymentInstallment(id).toPromise() as Promise<ApiResponse<PaymentInstallment>>;
  }

  async createPaymentInstallmentAsync(installment: CreatePaymentInstallment): Promise<ApiResponse<PaymentInstallment>> {
    return this.apiService.createPaymentInstallment(installment).toPromise() as Promise<ApiResponse<PaymentInstallment>>;
  }

  async updatePaymentInstallmentAsync(id: number, installment: UpdatePaymentInstallment): Promise<ApiResponse<PaymentInstallment>> {
    return this.apiService.updatePaymentInstallment(id, installment).toPromise() as Promise<ApiResponse<PaymentInstallment>>;
  }
}

