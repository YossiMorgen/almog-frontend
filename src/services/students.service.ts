import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Student, CreateStudent, UpdateStudent } from '../models/student';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  constructor(
    private apiService: ApiService,
    private tenantService: TenantService
  ) {}

  getStudents(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Student>>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.getStudents({ ...query, tenantId: tenantId ?? undefined });
  }

  getStudent(id: number): Observable<ApiResponse<Student>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.getStudent(id, tenantId ?? undefined);
  }

  createStudent(student: CreateStudent): Observable<ApiResponse<Student>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.createStudent(student, tenantId ?? undefined);
  }

  updateStudent(id: number, student: UpdateStudent): Observable<ApiResponse<Student>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.updateStudent(id, student, tenantId ?? undefined);
  }

  async getStudentsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Student>>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.getStudents({ ...query, tenantId: tenantId ?? undefined }).toPromise() as Promise<ApiResponse<PaginationResult<Student>>>;
  }

  async getStudentAsync(id: number): Promise<ApiResponse<Student>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.getStudent(id, tenantId ?? undefined).toPromise() as Promise<ApiResponse<Student>>;
  }

  async createStudentAsync(student: CreateStudent): Promise<ApiResponse<Student>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.createStudent(student, tenantId ?? undefined).toPromise() as Promise<ApiResponse<Student>>;
  }

  async updateStudentAsync(id: number, student: UpdateStudent): Promise<ApiResponse<Student>> {
    const tenantId = this.tenantService.getCurrentTenantId();
    return this.apiService.updateStudent(id, student, tenantId ?? undefined).toPromise() as Promise<ApiResponse<Student>>;
  }
}

