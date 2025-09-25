import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { StudentClass, CreateStudentClass, UpdateStudentClass } from '../models/studentClass';

@Injectable({
  providedIn: 'root'
})
export class StudentClassesService {
  constructor(private apiService: ApiService) {}

  getStudentClasses(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<StudentClass>>> {
    return this.apiService.getStudentClasses(query);
  }

  getStudentClass(id: number): Observable<ApiResponse<StudentClass>> {
    return this.apiService.getStudentClass(id);
  }

  createStudentClass(studentClass: CreateStudentClass): Observable<ApiResponse<StudentClass>> {
    return this.apiService.createStudentClass(studentClass);
  }

  updateStudentClass(id: number, studentClass: UpdateStudentClass): Observable<ApiResponse<StudentClass>> {
    return this.apiService.updateStudentClass(id, studentClass);
  }

  async getStudentClassesAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<StudentClass>>> {
    return this.apiService.getStudentClasses(query).toPromise() as Promise<ApiResponse<PaginationResult<StudentClass>>>;
  }

  async getStudentClassAsync(id: number): Promise<ApiResponse<StudentClass>> {
    return this.apiService.getStudentClass(id).toPromise() as Promise<ApiResponse<StudentClass>>;
  }

  async createStudentClassAsync(studentClass: CreateStudentClass): Promise<ApiResponse<StudentClass>> {
    return this.apiService.createStudentClass(studentClass).toPromise() as Promise<ApiResponse<StudentClass>>;
  }

  async updateStudentClassAsync(id: number, studentClass: UpdateStudentClass): Promise<ApiResponse<StudentClass>> {
    return this.apiService.updateStudentClass(id, studentClass).toPromise() as Promise<ApiResponse<StudentClass>>;
  }
}

