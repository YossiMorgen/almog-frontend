import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Payment, CreatePayment, UpdatePayment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  constructor(private apiService: ApiService) {}

  getPayments(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Payment>>> {
    return this.apiService.getPayments(query);
  }

  getPayment(id: number): Observable<ApiResponse<Payment>> {
    return this.apiService.getPayment(id);
  }

  createPayment(payment: CreatePayment): Observable<ApiResponse<Payment>> {
    return this.apiService.createPayment(payment);
  }

  updatePayment(id: number, payment: UpdatePayment): Observable<ApiResponse<Payment>> {
    return this.apiService.updatePayment(id, payment);
  }

  async getPaymentsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Payment>>> {
    return this.apiService.getPayments(query).toPromise() as Promise<ApiResponse<PaginationResult<Payment>>>;
  }

  async getPaymentAsync(id: number): Promise<ApiResponse<Payment>> {
    return this.apiService.getPayment(id).toPromise() as Promise<ApiResponse<Payment>>;
  }

  async createPaymentAsync(payment: CreatePayment): Promise<ApiResponse<Payment>> {
    return this.apiService.createPayment(payment).toPromise() as Promise<ApiResponse<Payment>>;
  }

  async updatePaymentAsync(id: number, payment: UpdatePayment): Promise<ApiResponse<Payment>> {
    return this.apiService.updatePayment(id, payment).toPromise() as Promise<ApiResponse<Payment>>;
  }
}

