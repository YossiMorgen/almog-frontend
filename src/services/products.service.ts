import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Product, CreateProduct, UpdateProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private apiService: ApiService) {}

  getProducts(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Product>>> {
    return this.apiService.getProducts(query);
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.apiService.getProduct(id);
  }

  createProduct(product: CreateProduct): Observable<ApiResponse<Product>> {
    return this.apiService.createProduct(product);
  }

  updateProduct(id: number, product: UpdateProduct): Observable<ApiResponse<Product>> {
    return this.apiService.updateProduct(id, product);
  }

  async getProductsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Product>>> {
    return this.apiService.getProducts(query).toPromise() as Promise<ApiResponse<PaginationResult<Product>>>;
  }

  async getProductAsync(id: number): Promise<ApiResponse<Product>> {
    return this.apiService.getProduct(id).toPromise() as Promise<ApiResponse<Product>>;
  }

  async createProductAsync(product: CreateProduct): Promise<ApiResponse<Product>> {
    return this.apiService.createProduct(product).toPromise() as Promise<ApiResponse<Product>>;
  }

  async updateProductAsync(id: number, product: UpdateProduct): Promise<ApiResponse<Product>> {
    return this.apiService.updateProduct(id, product).toPromise() as Promise<ApiResponse<Product>>;
  }
}

