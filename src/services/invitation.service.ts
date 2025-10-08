import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invitation, AcceptInvitationRequest } from '../models/invitation';
import { ApiService, ApiResponse } from './api.service';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly baseUrl = `${API_CONFIG.BASE_URL}/api/tenant-invitations`;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getUserInvitations(email: string): Observable<{ success: boolean; data: Invitation[] }> {
    return this.http.get<{ success: boolean; data: Invitation[] }>(`${this.baseUrl}/user/${email}/all`);
  }

  acceptInvitation(request: AcceptInvitationRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/accept`, request);
  }

  getPendingInvitationsForTenant(tenantId: string): Observable<{ success: boolean; data: Invitation[] }> {
    return this.http.get<{ success: boolean; data: Invitation[] }>(`${this.baseUrl}?tenantId=${tenantId}`);
  }

  createInvitation(invitationData: {
    invited_email: string;
    invited_roles: number[];
    expires_days: number;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, invitationData);
  }

  async createInvitationAsync(invitationData: {
    invited_email: string;
    invited_roles: number[];
    expires_days: number;
  }): Promise<ApiResponse<any>> {
    return this.createInvitation(invitationData).toPromise() as Promise<ApiResponse<any>>;
  }

  cancelInvitation(invitationId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${invitationId}`);
  }

  async cancelInvitationAsync(invitationId: number): Promise<{ success: boolean; message: string }> {
    return this.cancelInvitation(invitationId).toPromise() as Promise<{ success: boolean; message: string }>;
  }

  resendInvitation(invitationData: {
    invited_email: string;
    invited_roles: number[];
    expires_days: number;
  }): Observable<ApiResponse<any>> {
    return this.createInvitation(invitationData);
  }

  async resendInvitationAsync(invitationData: {
    invited_email: string;
    invited_roles: number[];
    expires_days: number;
  }): Promise<ApiResponse<any>> {
    return this.resendInvitation(invitationData).toPromise() as Promise<ApiResponse<any>>;
  }
}
