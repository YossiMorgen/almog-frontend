import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { User, CreateUser, UpdateUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiService) {}

  getUsers(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<User>>> {
    return this.apiService.getUsers(query);
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.apiService.getUser(id);
  }

  createUser(user: CreateUser): Observable<ApiResponse<User>> {
    return this.apiService.createUser(user);
  }

  updateUser(id: number, user: UpdateUser): Observable<ApiResponse<User>> {
    return this.apiService.updateUser(id, user);
  }

  async getUsersAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<User>>> {
    return this.apiService.getUsers(query).toPromise() as Promise<ApiResponse<PaginationResult<User>>>;
  }

  async getUserAsync(id: number): Promise<ApiResponse<User>> {
    return this.apiService.getUser(id).toPromise() as Promise<ApiResponse<User>>;
  }

  async createUserAsync(user: CreateUser): Promise<ApiResponse<User>> {
    return this.apiService.createUser(user).toPromise() as Promise<ApiResponse<User>>;
  }

  async updateUserAsync(id: number, user: UpdateUser): Promise<ApiResponse<User>> {
    return this.apiService.updateUser(id, user).toPromise() as Promise<ApiResponse<User>>;
  }
}

