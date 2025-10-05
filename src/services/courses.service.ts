import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Course, CreateCourse, UpdateCourse } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private apiService: ApiService) {}

  getCourses(query: any = {}): Observable<ApiResponse<PaginationResult<Course>>> {
    return this.apiService.getCourses(query);
  }

  getCourse(id: number): Observable<ApiResponse<Course>> {
    return this.apiService.getCourse(id);
  }

  createCourse(course: CreateCourse): Observable<ApiResponse<Course>> {
    return this.apiService.createCourse(course);
  }

  updateCourse(id: number, course: UpdateCourse): Observable<ApiResponse<Course>> {
    return this.apiService.updateCourse(id, course);
  }

  async getCoursesAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Course>>> {
    return this.apiService.getCourses(query).toPromise() as Promise<ApiResponse<PaginationResult<Course>>>;
  }

  async getCourseAsync(id: number): Promise<ApiResponse<Course>> {
    return this.apiService.getCourse(id).toPromise() as Promise<ApiResponse<Course>>;
  }

  async createCourseAsync(course: CreateCourse): Promise<ApiResponse<Course>> {
    return this.apiService.createCourse(course).toPromise() as Promise<ApiResponse<Course>>;
  }

  async updateCourseAsync(id: number, course: UpdateCourse): Promise<ApiResponse<Course>> {
    return this.apiService.updateCourse(id, course).toPromise() as Promise<ApiResponse<Course>>;
  }
}


