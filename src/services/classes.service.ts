import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Class, CreateClass, UpdateClass } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  constructor(private apiService: ApiService) {}

  getClasses(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Class>>> {
    return this.apiService.getClasses(query);
  }

  getClass(id: number): Observable<ApiResponse<Class>> {
    return this.apiService.getClass(id);
  }

  createClass(classData: CreateClass): Observable<ApiResponse<Class>> {
    return this.apiService.createClass(classData);
  }

  updateClass(id: number, classData: UpdateClass): Observable<ApiResponse<Class>> {
    return this.apiService.updateClass(id, classData);
  }

  async getClassesAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Class>>> {
    return this.apiService.getClasses(query).toPromise() as Promise<ApiResponse<PaginationResult<Class>>>;
  }

  async getClassAsync(id: number): Promise<ApiResponse<Class>> {
    return this.apiService.getClass(id).toPromise() as Promise<ApiResponse<Class>>;
  }

  async createClassAsync(classData: CreateClass): Promise<ApiResponse<Class>> {
    return this.apiService.createClass(classData).toPromise() as Promise<ApiResponse<Class>>;
  }

  async updateClassAsync(id: number, classData: UpdateClass): Promise<ApiResponse<Class>> {
    return this.apiService.updateClass(id, classData).toPromise() as Promise<ApiResponse<Class>>;
  }
}


