import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Order, CreateOrder, UpdateOrder } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private apiService: ApiService) {}

  getOrders(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Order>>> {
    return this.apiService.getOrders(query);
  }

  getOrder(id: number): Observable<ApiResponse<Order>> {
    return this.apiService.getOrder(id);
  }

  createOrder(order: CreateOrder): Observable<ApiResponse<Order>> {
    return this.apiService.createOrder(order);
  }

  updateOrder(id: number, order: UpdateOrder): Observable<ApiResponse<Order>> {
    return this.apiService.updateOrder(id, order);
  }

  async getOrdersAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Order>>> {
    return this.apiService.getOrders(query).toPromise() as Promise<ApiResponse<PaginationResult<Order>>>;
  }

  async getOrderAsync(id: number): Promise<ApiResponse<Order>> {
    return this.apiService.getOrder(id).toPromise() as Promise<ApiResponse<Order>>;
  }

  async createOrderAsync(order: CreateOrder): Promise<ApiResponse<Order>> {
    return this.apiService.createOrder(order).toPromise() as Promise<ApiResponse<Order>>;
  }

  async updateOrderAsync(id: number, order: UpdateOrder): Promise<ApiResponse<Order>> {
    return this.apiService.updateOrder(id, order).toPromise() as Promise<ApiResponse<Order>>;
  }
}

