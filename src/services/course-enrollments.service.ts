import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { CourseEnrollment, CreateCourseEnrollment, UpdateCourseEnrollment } from '../models/courseEnrollment';

@Injectable({
  providedIn: 'root'
})
export class CourseEnrollmentsService {
  constructor(private apiService: ApiService) {}

  getCourseEnrollments(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<CourseEnrollment>>> {
    return this.apiService.getCourseEnrollments(query);
  }

  getCourseEnrollment(id: number): Observable<ApiResponse<CourseEnrollment>> {
    return this.apiService.getCourseEnrollment(id);
  }

  createCourseEnrollment(enrollment: CreateCourseEnrollment): Observable<ApiResponse<CourseEnrollment>> {
    return this.apiService.createCourseEnrollment(enrollment);
  }

  updateCourseEnrollment(id: number, enrollment: UpdateCourseEnrollment): Observable<ApiResponse<CourseEnrollment>> {
    return this.apiService.updateCourseEnrollment(id, enrollment);
  }

  async getCourseEnrollmentsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<CourseEnrollment>>> {
    return this.apiService.getCourseEnrollments(query).toPromise() as Promise<ApiResponse<PaginationResult<CourseEnrollment>>>;
  }

  async getCourseEnrollmentAsync(id: number): Promise<ApiResponse<CourseEnrollment>> {
    return this.apiService.getCourseEnrollment(id).toPromise() as Promise<ApiResponse<CourseEnrollment>>;
  }

  async createCourseEnrollmentAsync(enrollment: CreateCourseEnrollment): Promise<ApiResponse<CourseEnrollment>> {
    return this.apiService.createCourseEnrollment(enrollment).toPromise() as Promise<ApiResponse<CourseEnrollment>>;
  }

  async updateCourseEnrollmentAsync(id: number, enrollment: UpdateCourseEnrollment): Promise<ApiResponse<CourseEnrollment>> {
    return this.apiService.updateCourseEnrollment(id, enrollment).toPromise() as Promise<ApiResponse<CourseEnrollment>>;
  }
}

