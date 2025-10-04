import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { HealthInsurance, CreateHealthInsurance, UpdateHealthInsurance } from '../models/healthInsurance';
import { StudentHealthInsurance, CreateStudentHealthInsurance, UpdateStudentHealthInsurance } from '../models/studentHealthInsurance';

@Injectable({
  providedIn: 'root'
})
export class HealthInsuranceService {
  constructor(
    private apiService: ApiService
  ) {}

  getHealthInsurances(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<HealthInsurance>>> {
    return this.apiService.getHealthInsurances(query);
  }

  getHealthInsurance(id: number): Observable<ApiResponse<HealthInsurance>> {
    return this.apiService.getHealthInsurance(id);
  }

  createHealthInsurance(healthInsurance: CreateHealthInsurance): Observable<ApiResponse<HealthInsurance>> {
    return this.apiService.createHealthInsurance(healthInsurance);
  }

  updateHealthInsurance(id: number, healthInsurance: UpdateHealthInsurance): Observable<ApiResponse<HealthInsurance>> {
    return this.apiService.updateHealthInsurance(id, healthInsurance);
  }

  deleteHealthInsurance(id: number): Observable<ApiResponse<void>> {
    return this.apiService.deleteHealthInsurance(id);
  }

  async getHealthInsurancesAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<HealthInsurance>>> {
    return this.apiService.getHealthInsurances(query).toPromise() as Promise<ApiResponse<PaginationResult<HealthInsurance>>>;
  }

  async getHealthInsuranceAsync(id: number): Promise<ApiResponse<HealthInsurance>> {
    return this.apiService.getHealthInsurance(id).toPromise() as Promise<ApiResponse<HealthInsurance>>;
  }

  async createHealthInsuranceAsync(healthInsurance: CreateHealthInsurance): Promise<ApiResponse<HealthInsurance>> {
    return this.apiService.createHealthInsurance(healthInsurance).toPromise() as Promise<ApiResponse<HealthInsurance>>;
  }

  async updateHealthInsuranceAsync(id: number, healthInsurance: UpdateHealthInsurance): Promise<ApiResponse<HealthInsurance>> {
    return this.apiService.updateHealthInsurance(id, healthInsurance).toPromise() as Promise<ApiResponse<HealthInsurance>>;
  }

  async deleteHealthInsuranceAsync(id: number): Promise<ApiResponse<void>> {
    return this.apiService.deleteHealthInsurance(id).toPromise() as Promise<ApiResponse<void>>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class StudentHealthInsuranceService {
  constructor(
    private apiService: ApiService
  ) {}

  getStudentHealthInsurances(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<StudentHealthInsurance>>> {
    return this.apiService.getStudentHealthInsurances(query);
  }

  getStudentHealthInsurance(id: number): Observable<ApiResponse<StudentHealthInsurance>> {
    return this.apiService.getStudentHealthInsurance(id);
  }

  getByStudentId(studentId: number): Observable<ApiResponse<StudentHealthInsurance[]>> {
    return this.apiService.getStudentHealthInsuranceByStudentId(studentId);
  }

  getByHealthInsuranceId(healthInsuranceId: number): Observable<ApiResponse<StudentHealthInsurance[]>> {
    return this.apiService.getStudentHealthInsuranceByHealthInsuranceId(healthInsuranceId);
  }

  createStudentHealthInsurance(studentHealthInsurance: CreateStudentHealthInsurance): Observable<ApiResponse<StudentHealthInsurance>> {
    return this.apiService.createStudentHealthInsurance(studentHealthInsurance);
  }

  updateStudentHealthInsurance(id: number, studentHealthInsurance: UpdateStudentHealthInsurance): Observable<ApiResponse<StudentHealthInsurance>> {
    return this.apiService.updateStudentHealthInsurance(id, studentHealthInsurance);
  }

  deleteStudentHealthInsurance(id: number): Observable<ApiResponse<void>> {
    return this.apiService.deleteStudentHealthInsurance(id);
  }

  async getStudentHealthInsurancesAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<StudentHealthInsurance>>> {
    return this.apiService.getStudentHealthInsurances(query).toPromise() as Promise<ApiResponse<PaginationResult<StudentHealthInsurance>>>;
  }

  async getStudentHealthInsuranceAsync(id: number): Promise<ApiResponse<StudentHealthInsurance>> {
    return this.apiService.getStudentHealthInsurance(id).toPromise() as Promise<ApiResponse<StudentHealthInsurance>>;
  }

  async getByStudentIdAsync(studentId: number): Promise<ApiResponse<StudentHealthInsurance[]>> {
    return this.apiService.getStudentHealthInsuranceByStudentId(studentId).toPromise() as Promise<ApiResponse<StudentHealthInsurance[]>>;
  }

  async getByHealthInsuranceIdAsync(healthInsuranceId: number): Promise<ApiResponse<StudentHealthInsurance[]>> {
    return this.apiService.getStudentHealthInsuranceByHealthInsuranceId(healthInsuranceId).toPromise() as Promise<ApiResponse<StudentHealthInsurance[]>>;
  }

  async createStudentHealthInsuranceAsync(studentHealthInsurance: CreateStudentHealthInsurance): Promise<ApiResponse<StudentHealthInsurance>> {
    return this.apiService.createStudentHealthInsurance(studentHealthInsurance).toPromise() as Promise<ApiResponse<StudentHealthInsurance>>;
  }

  async updateStudentHealthInsuranceAsync(id: number, studentHealthInsurance: UpdateStudentHealthInsurance): Promise<ApiResponse<StudentHealthInsurance>> {
    return this.apiService.updateStudentHealthInsurance(id, studentHealthInsurance).toPromise() as Promise<ApiResponse<StudentHealthInsurance>>;
  }

  async deleteStudentHealthInsuranceAsync(id: number): Promise<ApiResponse<void>> {
    return this.apiService.deleteStudentHealthInsurance(id).toPromise() as Promise<ApiResponse<void>>;
  }
}



