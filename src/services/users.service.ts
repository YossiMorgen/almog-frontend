import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse, PaginationResult } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getUsers(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    searchMode?: 'simple' | 'advanced';
    roleFilter?: string;
  }): Observable<ApiResponse<PaginationResult<User>>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginationResult<User>>>('http://localhost:3040/api/users', {
      params: httpParams
    });
  }

  getUsersByRole(roleName: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }): Observable<ApiResponse<PaginationResult<User>>> {
    return this.getUsers({
      ...params,
      roleFilter: roleName
    });
  }

  getInstructors(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }): Observable<ApiResponse<PaginationResult<User>>> {
    return this.getUsersByRole('instructor', params);
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.apiService.getUser(id);
  }

  createUser(user: any): Observable<ApiResponse<User>> {
    return this.apiService.createUser(user);
  }

  updateUser(id: number, user: any): Observable<ApiResponse<User>> {
    return this.apiService.updateUser(id, user);
  }

  async updateUserAsync(id: number, user: any): Promise<User> {
    return new Promise((resolve, reject) => {
      this.updateUser(id, user).subscribe({
        next: (response) => resolve(response.data),
        error: (error) => reject(error)
      });
    });
  }

  async createUserAsync(user: any): Promise<User> {
    return new Promise((resolve, reject) => {
      this.createUser(user).subscribe({
        next: (response) => resolve(response.data),
        error: (error) => reject(error)
      });
    });
  }

  // User role management methods
  assignRolesToUser(userId: number, roleIds: number[], tenantId: string): Observable<any> {
    return this.http.post('http://localhost:3040/api/user-roles/assign', {
      user_id: userId,
      role_ids: roleIds
    }, {
      params: { tenantId }
    });
  }

  updateUserRoles(userId: number, roleIds: number[], tenantId: string): Observable<any> {
    return this.http.put(`http://localhost:3040/api/user-roles/${userId}`, {
      role_ids: roleIds
    }, {
      params: { tenantId }
    });
  }

  getUserRoles(userId: number, tenantId: string): Observable<any> {
    return this.http.get(`http://localhost:3040/api/user-roles/${userId}`, {
      params: { tenantId }
    });
  }

  removeRoleFromUser(userId: number, roleId: number, tenantId: string): Observable<any> {
    return this.http.delete(`http://localhost:3040/api/user-roles/${userId}/${roleId}`, {
      params: { tenantId }
    });
  }
}