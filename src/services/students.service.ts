import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Student, CreateStudent, UpdateStudent } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  constructor(private apiService: ApiService) {}

  getStudents(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Student>>> {
    return this.apiService.getStudents(query);
  }

  getStudent(id: number): Observable<ApiResponse<Student>> {
    return this.apiService.getStudent(id);
  }

  createStudent(student: CreateStudent): Observable<ApiResponse<Student>> {
    return this.apiService.createStudent(student);
  }

  updateStudent(id: number, student: UpdateStudent): Observable<ApiResponse<Student>> {
    return this.apiService.updateStudent(id, student);
  }

  async getStudentsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Student>>> {
    return this.apiService.getStudents(query).toPromise() as Promise<ApiResponse<PaginationResult<Student>>>;
  }

  async getStudentAsync(id: number): Promise<ApiResponse<Student>> {
    return this.apiService.getStudent(id).toPromise() as Promise<ApiResponse<Student>>;
  }

  async createStudentAsync(student: CreateStudent): Promise<ApiResponse<Student>> {
    return this.apiService.createStudent(student).toPromise() as Promise<ApiResponse<Student>>;
  }

  async updateStudentAsync(id: number, student: UpdateStudent): Promise<ApiResponse<Student>> {
    return this.apiService.updateStudent(id, student).toPromise() as Promise<ApiResponse<Student>>;
  }
}

