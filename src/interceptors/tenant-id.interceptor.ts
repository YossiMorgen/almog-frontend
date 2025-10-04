import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';
import { API_CONFIG } from '../config/api.config';

export const tenantIdInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  
  const isApi = req.url.startsWith(API_CONFIG.BASE_URL);
  const isLoginEndpoint = req.url.includes('/api/auth/login');
  const isHealthEndpoint = req.url.includes('/health');
  const isUserTenantsEndpoint = req.url.includes('/api/user-tenants');
  
  if (isApi && !isLoginEndpoint && !isHealthEndpoint && !isUserTenantsEndpoint) {
    const currentTenant = tenantService.getCurrentTenant();
    if (currentTenant?.id) {
      const url = new URL(req.url);
      url.searchParams.set('tenantId', currentTenant.id);
      req.headers.set('x-tenant-id', currentTenant.id);
      
      const modified = req.clone({
        url: url.toString(),
        headers: req.headers
      });
      
      return next(modified);
    }
  }
  
  return next(req);
};
