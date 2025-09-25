import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { OrderItem, CreateOrderItem, UpdateOrderItem } from '../models/orderItem';

@Injectable({
  providedIn: 'root'
})
export class OrderItemsService {
  constructor(private apiService: ApiService) {}

  getOrderItems(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<OrderItem>>> {
    return this.apiService.getOrderItems(query);
  }

  getOrderItem(id: number): Observable<ApiResponse<OrderItem>> {
    return this.apiService.getOrderItem(id);
  }

  createOrderItem(orderItem: CreateOrderItem): Observable<ApiResponse<OrderItem>> {
    return this.apiService.createOrderItem(orderItem);
  }

  updateOrderItem(id: number, orderItem: UpdateOrderItem): Observable<ApiResponse<OrderItem>> {
    return this.apiService.updateOrderItem(id, orderItem);
  }

  async getOrderItemsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<OrderItem>>> {
    return this.apiService.getOrderItems(query).toPromise() as Promise<ApiResponse<PaginationResult<OrderItem>>>;
  }

  async getOrderItemAsync(id: number): Promise<ApiResponse<OrderItem>> {
    return this.apiService.getOrderItem(id).toPromise() as Promise<ApiResponse<OrderItem>>;
  }

  async createOrderItemAsync(orderItem: CreateOrderItem): Promise<ApiResponse<OrderItem>> {
    return this.apiService.createOrderItem(orderItem).toPromise() as Promise<ApiResponse<OrderItem>>;
  }

  async updateOrderItemAsync(id: number, orderItem: UpdateOrderItem): Promise<ApiResponse<OrderItem>> {
    return this.apiService.updateOrderItem(id, orderItem).toPromise() as Promise<ApiResponse<OrderItem>>;
  }
}

