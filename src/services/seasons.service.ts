import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginationQuery, PaginationResult, ApiResponse } from './api.service';
import { Season, CreateSeason, UpdateSeason } from '../models/season';

@Injectable({
  providedIn: 'root'
})
export class SeasonsService {
  constructor(private apiService: ApiService) {}

  getSeasons(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Season>>> {
    return this.apiService.getSeasons(query);
  }

  getSeason(id: number): Observable<ApiResponse<Season>> {
    return this.apiService.getSeason(id);
  }

  createSeason(season: CreateSeason): Observable<ApiResponse<Season>> {
    return this.apiService.createSeason(season);
  }

  updateSeason(id: number, season: UpdateSeason): Observable<ApiResponse<Season>> {
    return this.apiService.updateSeason(id, season);
  }

  async getSeasonsAsync(query: PaginationQuery = {}): Promise<ApiResponse<PaginationResult<Season>>> {
    return this.apiService.getSeasons(query).toPromise() as Promise<ApiResponse<PaginationResult<Season>>>;
  }

  async getSeasonAsync(id: number): Promise<ApiResponse<Season>> {
    return this.apiService.getSeason(id).toPromise() as Promise<ApiResponse<Season>>;
  }

  async createSeasonAsync(season: CreateSeason): Promise<ApiResponse<Season>> {
    return this.apiService.createSeason(season).toPromise() as Promise<ApiResponse<Season>>;
  }

  async updateSeasonAsync(id: number, season: UpdateSeason): Promise<ApiResponse<Season>> {
    return this.apiService.updateSeason(id, season).toPromise() as Promise<ApiResponse<Season>>;
  }
}


