import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Tenant, UserTenantsResponse } from '../models/tenant';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly STORAGE_KEY = 'selectedTenant';
  
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  private userTenantsSubject = new BehaviorSubject<Tenant[]>([]);
  
  public currentTenant$ = this.currentTenantSubject.asObservable();
  public userTenants$ = this.userTenantsSubject.asObservable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.loadTenantFromUrlOrStorage();
  }

  async initializeTenantSelection(): Promise<void> {
    try {
      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }

      const tenants = await this.fetchUserTenants();
      
      if (tenants.length === 0) {
        console.warn('No tenants found for user');
        this.router.navigate(['/login']);
        return;
      }

      if (tenants.length === 1) {
        this.selectTenant(tenants[0]);
        return;
      }

      const urlTenantId = this.getTenantIdFromUrl();
      if (urlTenantId) {
        const tenant = tenants.find(t => t.id === urlTenantId);
        if (tenant) {
          this.selectTenant(tenant);
          return;
        }
      }

      const storedTenant = this.getStoredTenant();
      if (storedTenant && tenants.some(t => t.id === storedTenant.id)) {
        this.selectTenant(storedTenant);
        return;
      }

      this.router.navigate(['/tenant-selection']);
    } catch (error) {
      console.error('Error initializing tenant selection:', error);
      this.router.navigate(['/login']);
    }
  }

  private async fetchUserTenants(): Promise<Tenant[]> {
    const token = await this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    return this.apiService.getUserTenants().pipe(
      tap(response => {
        this.userTenantsSubject.next(response.data.tenants);
      }),
      catchError(error => {
        console.error('Error fetching user tenants:', error);
        return throwError(() => error);
      })
    ).toPromise().then(response => response?.data.tenants || []);
  }

  selectTenant(tenant: Tenant): void {
    this.currentTenantSubject.next(tenant);
    this.storeTenant(tenant);
    this.updateUrlWithTenantId(tenant.id);
    
    const currentUrl = this.router.url;
    if (currentUrl === '/tenant-selection') {
      this.router.navigate(['/dashboard']);
    }
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }

  getCurrentTenantId(): number | null {
    const urlTenantId = this.getTenantIdFromUrl();
    if (urlTenantId) {
      return urlTenantId;
    }
    
    const tenant = this.getCurrentTenant();
    return tenant ? tenant.id : null;
  }

  getUserTenants(): Tenant[] {
    return this.userTenantsSubject.value;
  }

  clearTenantSelection(): void {
    this.currentTenantSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.removeTenantIdFromUrl();
  }

  private loadTenantFromUrlOrStorage(): void {
    const urlTenantId = this.getTenantIdFromUrl();
    if (urlTenantId) {
      const storedTenant = this.getStoredTenant();
      if (storedTenant && storedTenant.id === urlTenantId) {
        this.currentTenantSubject.next(storedTenant);
      }
    } else {
      const storedTenant = this.getStoredTenant();
      if (storedTenant) {
        this.currentTenantSubject.next(storedTenant);
      }
    }
  }

  private getTenantIdFromUrl(): number | null {
    const tenantId = this.route.snapshot.queryParams['tenantId'];
    return tenantId ? parseInt(tenantId, 10) : null;
  }

  private updateUrlWithTenantId(tenantId: number): void {
    const currentUrl = this.router.url.split('?')[0];
    const queryParams = { ...this.route.snapshot.queryParams, tenantId: tenantId.toString() };
    this.router.navigate([currentUrl], { queryParams, replaceUrl: true });
  }

  private removeTenantIdFromUrl(): void {
    const currentUrl = this.router.url.split('?')[0];
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['tenantId'];
    this.router.navigate([currentUrl], { queryParams, replaceUrl: true });
  }

  private getStoredTenant(): Tenant | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored tenant:', error);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  private storeTenant(tenant: Tenant): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tenant));
    } catch (error) {
      console.error('Error storing tenant:', error);
    }
  }

  async refreshUserTenants(): Promise<void> {
    try {
      await this.fetchUserTenants();
    } catch (error) {
      console.error('Error refreshing user tenants:', error);
    }
  }

  isTenantSelected(): boolean {
    return this.getCurrentTenantId() !== null;
  }

  hasMultipleTenants(): boolean {
    return this.getUserTenants().length > 1;
  }

  logout(): void {
    this.clearTenantSelection();
    this.userTenantsSubject.next([]);
  }

  getUserTenantsFromApi(): Observable<UserTenantsResponse> {
    return this.apiService.getUserTenants();
  }

  async getUserTenantsAsync(): Promise<UserTenantsResponse> {
    return this.apiService.getUserTenants().toPromise() as Promise<UserTenantsResponse>;
  }
}
