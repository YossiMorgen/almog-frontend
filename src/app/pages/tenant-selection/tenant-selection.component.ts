import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService } from '../../../services/tenant.service';
import { Tenant } from '../../../models/tenant';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tenant-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-selection.component.html',
  styleUrls: ['./tenant-selection.component.scss']
})
export class TenantSelectionComponent implements OnInit {
  tenants$: Observable<Tenant[]>;
  isLoading = true;
  error: string | null = null;

  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {
    this.tenants$ = this.tenantService.userTenants$;
  }

  ngOnInit(): void {
    this.loadTenants();
  }

  async loadTenants(): Promise<void> {
    try {
      await this.tenantService.refreshUserTenants();
      this.isLoading = false;
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
    this.router.navigate(['/login']);
  }
}