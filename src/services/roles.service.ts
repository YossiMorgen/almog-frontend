import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Role, CreateRole, UpdateRole } from '../models/role';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private apiService: ApiService) {}

  getRoles(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Role>>> {
    return this.apiService.getRoles(query);
  }

  getRole(id: number): Observable<ApiResponse<Role>> {
    return this.apiService.getRole(id);
  }

  createRole(role: CreateRole): Observable<ApiResponse<Role>> {
    return this.apiService.createRole(role);
  }

  updateRole(id: number, role: UpdateRole): Observable<ApiResponse<Role>> {
    return this.apiService.updateRole(id, role);
  }

  async getRolesAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Role>>> {
    return this.apiService.getRoles(query).toPromise() as Promise<ApiResponse<PaginationResult<Role>>>;
  }

  async getRoleAsync(id: number): Promise<ApiResponse<Role>> {
    return this.apiService.getRole(id).toPromise() as Promise<ApiResponse<Role>>;
  }

  async createRoleAsync(role: CreateRole): Promise<ApiResponse<Role>> {
    return this.apiService.createRole(role).toPromise() as Promise<ApiResponse<Role>>;
  }

  async updateRoleAsync(id: number, role: UpdateRole): Promise<ApiResponse<Role>> {
    return this.apiService.updateRole(id, role).toPromise() as Promise<ApiResponse<Role>>;
  }
}

