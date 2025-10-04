import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TenantService } from '../services/tenant.service';
import { AuthService } from '../services';

@Injectable({ providedIn: 'root' })
export class TenantGuard implements CanActivate {
  constructor(
    private tenantService: TenantService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const tenantCheckPromise = this.checkTenantSelection();
    const timeoutPromise = new Promise<undefined>((_, reject) => 
      setTimeout(() => reject(new Error('Tenant check timeout')), 15000)
    );
    
    return from(Promise.race([tenantCheckPromise, timeoutPromise])).pipe(
      map(hasTenant => {
        if (hasTenant) {
          console.log('TenantGuard: Tenant selected, allowing access');
          return true;
        } else {
          console.log('TenantGuard: No tenant selected, redirecting to tenant selection');
          return this.router.createUrlTree(['/tenant-selection']);
        }
      }),
      catchError(error => {
        console.error('TenantGuard: Error checking tenant selection:', error);
        if (error.message === 'Tenant check timeout') {
          console.log('TenantGuard: Timeout reached, redirecting to tenant selection');
        }
        return from([this.router.createUrlTree(['/tenant-selection'])]);
      })
    );
  }

  private async checkTenantSelection(): Promise<boolean> {
    try {
      console.log('TenantGuard: Starting tenant check');
      
      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        console.log('TenantGuard: User not logged in');
        return false;
      }

      const currentTenantId = this.tenantService.getCurrentTenantId();
      const urlTenantId = this.getTenantIdFromUrl();
      
      console.log('TenantGuard: Current tenant ID:', currentTenantId);
      console.log('TenantGuard: URL tenant ID:', urlTenantId);
      
      if (currentTenantId && urlTenantId && currentTenantId === urlTenantId) {
        console.log('TenantGuard: Tenant IDs match, allowing access');
        return true;
      }

      // Only update URL if we're on a route that should have tenant context
      const currentPath = this.router.url.split('?')[0];
      const shouldHaveTenantInUrl = this.shouldRouteHaveTenantId(currentPath);

      if (currentTenantId && !urlTenantId && shouldHaveTenantInUrl) {
        console.log('TenantGuard: Has tenant but no URL tenant ID, updating URL');
        this.updateUrlWithTenantId(currentTenantId);
        return true;
      }

      if (currentTenantId && urlTenantId && currentTenantId !== urlTenantId && shouldHaveTenantInUrl) {
        console.log('TenantGuard: Tenant IDs mismatch, updating URL with current tenant');
        this.updateUrlWithTenantId(currentTenantId);
        return true;
      }

      const hasTenant = this.tenantService.isTenantSelected();
      console.log('TenantGuard: Has tenant selected:', hasTenant);
      
      if (!hasTenant) {
        console.log('TenantGuard: No tenant selected, initializing tenant selection');
        await this.tenantService.initializeTenantSelection();
        
        const stillHasTenant = this.tenantService.isTenantSelected();
        console.log('TenantGuard: After initialization, has tenant:', stillHasTenant);
        
        if (stillHasTenant && shouldHaveTenantInUrl) {
          const finalTenantId = this.tenantService.getCurrentTenantId();
          if (finalTenantId && !this.getTenantIdFromUrl()) {
            this.updateUrlWithTenantId(finalTenantId);
          }
        }
        
        return stillHasTenant;
      }

      return hasTenant;
    } catch (error) {
      console.error('TenantGuard: Error in checkTenantSelection:', error);
      return false;
    }
  }

  private getTenantIdFromUrl(): string | null {
    const url = new URL(window.location.href);
    const tenantId = url.searchParams.get('tenantId');
    console.log('TenantGuard: Getting tenant ID from URL:', tenantId);
    return tenantId;
  }

  private shouldRouteHaveTenantId(path: string): boolean {
    // Routes that should have tenant ID in URL
    const tenantRoutes = ['/crm', '/unauthorized'];
    
    // Check if the path starts with any tenant route
    return tenantRoutes.some(route => path.startsWith(route));
  }

  private updateUrlWithTenantId(tenantId: string): void {
    const url = new URL(window.location.href);
    const currentTenantId = url.searchParams.get('tenantId');
    
    if (currentTenantId === tenantId) {
      console.log('TenantGuard: URL already has correct tenant ID, skipping update');
      return;
    }
    
    console.log('TenantGuard: Updating URL with tenant ID:', tenantId);
    const queryParams = { tenantId: tenantId };
    const currentPath = this.router.url.split('?')[0];
    
    setTimeout(() => {
      this.router.navigate([currentPath], { queryParams, replaceUrl: true });
    }, 0);
  }
}
