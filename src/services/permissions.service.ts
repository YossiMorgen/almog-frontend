import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Permission, CreatePermission, UpdatePermission } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private apiService: ApiService) {}

  getPermissions(query: any = {}): Observable<ApiResponse<PaginationResult<Permission>>> {
    return this.apiService.getPermissions(query);
  }

  getPermission(id: number): Observable<ApiResponse<Permission>> {
    return this.apiService.getPermission(id);
  }

  createPermission(permission: CreatePermission): Observable<ApiResponse<Permission>> {
    return this.apiService.createPermission(permission);
  }

  updatePermission(id: number, permission: UpdatePermission): Observable<ApiResponse<Permission>> {
    return this.apiService.updatePermission(id, permission);
  }

  async getPermissionsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Permission>>> {
    return this.apiService.getPermissions(query).toPromise() as Promise<ApiResponse<PaginationResult<Permission>>>;
  }

  async getPermissionAsync(id: number): Promise<ApiResponse<Permission>> {
    return this.apiService.getPermission(id).toPromise() as Promise<ApiResponse<Permission>>;
  }

  async createPermissionAsync(permission: CreatePermission): Promise<ApiResponse<Permission>> {
    return this.apiService.createPermission(permission).toPromise() as Promise<ApiResponse<Permission>>;
  }

  async updatePermissionAsync(id: number, permission: UpdatePermission): Promise<ApiResponse<Permission>> {
    return this.apiService.updatePermission(id, permission).toPromise() as Promise<ApiResponse<Permission>>;
  }
}

