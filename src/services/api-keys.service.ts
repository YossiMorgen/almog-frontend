import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../config/api.config';

export interface ApiKey {
  id?: number;
  key_name: string;
  api_key_prefix: string;
  api_key?: string; // Only present when creating/regenerating
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateApiKeyRequest {
  key_name: string;
  is_active?: boolean;
}

export interface UpdateApiKeyRequest {
  key_name?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService {
  private readonly baseUrl = `${environment.apiUrl}/api-keys`;

  constructor(private http: HttpClient) {}

  getApiKeys(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(this.baseUrl);
  }

  createApiKey(request: CreateApiKeyRequest): Observable<ApiKey> {
    return this.http.post<ApiKey>(this.baseUrl, request);
  }

  updateApiKey(id: number, request: UpdateApiKeyRequest): Observable<ApiKey> {
    return this.http.put<ApiKey>(`${this.baseUrl}/${id}`, request);
  }

  deleteApiKey(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  regenerateApiKey(id: number): Observable<ApiKey> {
    return this.http.post<ApiKey>(`${this.baseUrl}/${id}/regenerate`, {});
  }
}
