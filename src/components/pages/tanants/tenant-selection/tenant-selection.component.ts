import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService } from '../../../../services/tenant.service';
import { Tenant } from '../../../../models/tenant';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { InvitationService } from '../../../../services/invitation.service';
import { Invitation } from '../../../../models/invitation';

@Component({
  selector: 'app-tenant-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './tenant-selection.component.html',
  styleUrls: ['./tenant-selection.component.scss']
})
export class TenantSelectionComponent implements OnInit {
  tenants$: Observable<Tenant[]>;
  invitations: Invitation[] = [];
  isLoading = true;
  isLoadingInvitations = true;
  error: string | null = null;
  hasNoTenants = false;

  constructor(
    private tenantService: TenantService,
    private router: Router,
    private authService: AuthService,
    private invitationService: InvitationService
  ) {
    this.tenants$ = this.tenantService.userTenants$;
  }

  ngOnInit(): void {
    this.loadTenants();
    this.loadInvitations();
  }

  async loadTenants(): Promise<void> {
    try {
      await this.tenantService.refreshUserTenants();
      this.isLoading = false;
      
      this.tenants$.subscribe(tenants => {
        this.hasNoTenants = tenants.length === 0;
      });
    } catch (error) {
      console.error('Error loading tenants:', error);
      this.error = 'Failed to load tenants. Please try again.';
      this.isLoading = false;
    }
  }

  selectTenant(tenant: Tenant): void {
    this.tenantService.selectTenant(tenant);
  }

  logout(): void {
    this.tenantService.logout();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/tenant-create']);
  }

  async loadInvitations(): Promise<void> {
    try {
      const user = this.authService.firebaseUser;
      if (!user?.email) {
        this.isLoadingInvitations = false;
        return;
      }

      const response = await this.invitationService.getUserInvitations(user.email).toPromise();
      if (response?.success) {
        this.invitations = response.data;
      }
      this.isLoadingInvitations = false;
    } catch (error) {
      console.error('Error loading invitations:', error);
      this.isLoadingInvitations = false;
    }
  }

  async acceptInvitation(invitation: Invitation): Promise<void> {
    try {
      const user = this.authService.firebaseUser;
      if (!user) {
        console.error('No user found');
        return;
      }

      const request = {
        invitation_token: invitation.id.toString(),
        firebase_uid: user.uid,
        first_name: user.displayName?.split(' ')[0] || '',
        last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
        display_name: user.displayName || '',
        profile_picture_url: user.photoURL || '',
        phone: user.phoneNumber || '',
        language: 'en' as const
      };

      const response = await this.invitationService.acceptInvitation(request).toPromise();
      if (response?.success) {
        this.invitations = this.invitations.filter(inv => inv.id !== invitation.id);
        await this.loadTenants();
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  }

  isInvitationExpired(invitation: Invitation): boolean {
    return new Date(invitation.expires_at) < new Date();
  }
}
