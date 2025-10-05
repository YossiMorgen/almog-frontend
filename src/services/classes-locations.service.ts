import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse, PaginationResult, PaginationQuery } from './api.service';
import { ClassesLocation, CreateClassesLocation, UpdateClassesLocation } from '../models/classesLocation';

@Injectable({
  providedIn: 'root'
})
export class ClassesLocationsService {
  constructor(
    private apiService: ApiService
  ) {}

  getClassesLocations(params?: PaginationQuery & {
    searchMode?: 'simple' | 'advanced';
    activeFilter?: boolean;
  }): Observable<ApiResponse<PaginationResult<ClassesLocation>>> {
    return this.apiService.getClassesLocations(params);
  }

  getActiveClassesLocations(params?: PaginationQuery): Observable<ApiResponse<PaginationResult<ClassesLocation>>> {
    return this.getClassesLocations({
      ...params,
      activeFilter: true
    });
  }

  getClassesLocation(id: number): Observable<ApiResponse<ClassesLocation>> {
    return this.apiService.getClassesLocation(id);
  }

  createClassesLocation(location: CreateClassesLocation): Observable<ApiResponse<ClassesLocation>> {
    return this.apiService.createClassesLocation(location);
  }

  updateClassesLocation(id: number, location: UpdateClassesLocation): Observable<ApiResponse<ClassesLocation>> {
    return this.apiService.updateClassesLocation(id, location);
  }

  deleteClassesLocation(id: number): Observable<ApiResponse<void>> {
    return this.apiService.deleteClassesLocation(id);
  }

  async createClassesLocationAsync(location: CreateClassesLocation): Promise<ClassesLocation> {
    return new Promise((resolve, reject) => {
      this.createClassesLocation(location).subscribe({
        next: (response) => resolve(response.data),
        error: (error) => reject(error)
      });
    });
  }

  async updateClassesLocationAsync(id: number, location: UpdateClassesLocation): Promise<ClassesLocation> {
    return new Promise((resolve, reject) => {
      this.updateClassesLocation(id, location).subscribe({
        next: (response) => resolve(response.data),
        error: (error) => reject(error)
      });
    });
  }

  async getClassesLocationAsync(id: number): Promise<ClassesLocation> {
    return new Promise((resolve, reject) => {
      this.getClassesLocation(id).subscribe({
        next: (response) => resolve(response.data),
        error: (error) => reject(error)
      });
    });
  }
}
