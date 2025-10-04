import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invitation, AcceptInvitationRequest } from '../models/invitation';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly baseUrl = 'http://localhost:3040/api/tenant-invitations';

  constructor(private http: HttpClient) {}

  getUserInvitations(email: string): Observable<{ success: boolean; data: Invitation[] }> {
    return this.http.get<{ success: boolean; data: Invitation[] }>(`${this.baseUrl}/user/${email}/all`);
  }

  acceptInvitation(request: AcceptInvitationRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/accept`, request);
  }

  getPendingInvitationsForTenant(tenantId: string): Observable<{ success: boolean; data: Invitation[] }> {
    return this.http.get<{ success: boolean; data: Invitation[] }>(`${this.baseUrl}?tenantId=${tenantId}`);
  }
}
