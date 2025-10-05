import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Tenant, CreateTenant, UserTenantsResponse, CreateTenantResponse, UserTenants } from '../models/tenant';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly STORAGE_KEY = 'selectedTenant';
  
  private currentTenantSubject = new BehaviorSubject<UserTenants | null>(null);
  private userTenantsSubject = new BehaviorSubject<Tenant[]>([]);
  private isInitializing = false;
  
  public currentTenant$ = this.currentTenantSubject.asObservable();
  public userTenants$ = this.userTenantsSubject.asObservable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.initializeFromStorage();
  }

  async initializeTenantSelection(): Promise<void> {
    if (this.isInitializing) {
      console.log('TenantService: Already initializing, skipping');
      return;
    }
    
    this.isInitializing = true;
    console.log('TenantService: Starting tenant selection initialization');
    
    try {
      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        console.log('TenantService: User not logged in, redirecting to login');
        this.router.navigate(['/login']);
        return;
      }

      const tenants = await this.fetchUserTenants();
      console.log('TenantService: Fetched tenants:', tenants.length);
      
      if (tenants.length === 0) {
        console.warn('No tenants found for user');
        this.router.navigate(['/tenant-selection']);
        return;
      }

      if (tenants.length === 1) {
        console.log('TenantService: Only one tenant, selecting it');
        this.selectTenant(tenants[0] as UserTenants);
        return;
      }

      const urlTenantId = this.getTenantIdFromUrl();
      console.log('TenantService: URL tenant ID:', urlTenantId);
      
      if (urlTenantId) {
        const tenant = tenants.find(t => t.id === urlTenantId);
        if (tenant) {
          console.log('TenantService: Found tenant from URL, selecting it');
          this.selectTenant(tenant as UserTenants);
          return;
        }
      }

      const storedTenant = this.getStoredTenant();
      console.log('TenantService: Stored tenant:', storedTenant);
      
      if (storedTenant && tenants.some(t => t.id === storedTenant.id)) {
        console.log('TenantService: Found valid stored tenant, selecting it');
        this.selectTenant(storedTenant as UserTenants);
        return;
      }

      console.log('TenantService: No valid tenant found, redirecting to selection');
      this.router.navigate(['/tenant-selection']);
    } catch (error) {
      console.error('Error initializing tenant selection:', error);
      this.router.navigate(['/login']);
    } finally {
      this.isInitializing = false;
    }
  }

  private async fetchUserTenants(): Promise<Tenant[]> {
    const token = await this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await firstValueFrom(
        this.apiService.getUserTenants().pipe(
          tap(response => {
            this.userTenantsSubject.next(response.data.tenants);
          }),
          catchError(error => {
            console.error('Error fetching user tenants:', error);
            return throwError(() => error);
          })
        )
      );
      return response?.data.tenants || [];
    } catch (error) {
      console.error('Error in fetchUserTenants:', error);
      throw error;
    }
  }

  selectTenant(tenant: UserTenants): void {
    const previousTenant = this.getCurrentTenant();
    this.currentTenantSubject.next(tenant);
    this.storeTenant(tenant);
    this.updateUrlWithTenantId(tenant.id as string);
    
    
    const currentUrl = this.router.url;
    if (currentUrl === '/tenant-selection' || currentUrl === '/tenant-create') {
      this.router.navigate(['/dashboard']);

    } else if(previousTenant?.id && previousTenant.id !== tenant.id as string) {
      window.location.reload();
    }
  }

  getCurrentTenant(): UserTenants | null {
    return this.currentTenantSubject.value;
  }

  getCurrentTenantId(): string | null {
    const tenant = this.getCurrentTenant();
    if (tenant?.id) {
      return tenant.id;
    }
    
    const urlTenantId = this.getTenantIdFromUrl();
    return urlTenantId;
  }

  getUserTenants(): Tenant[] {
    return this.userTenantsSubject.value;
  }

  clearTenantSelection(): void {
    this.currentTenantSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.removeTenantIdFromUrl();
  }

  private initializeFromStorage(): void {
    console.log('TenantService: Initializing from storage');
    const urlTenantId = this.getTenantIdFromUrl();
    console.log('TenantService: URL tenant ID:', urlTenantId);
    
    if (urlTenantId) {
      const storedTenant = this.getStoredTenant();
      console.log('TenantService: Stored tenant:', storedTenant);
      if (storedTenant && storedTenant.id === urlTenantId) {
        console.log('TenantService: Setting tenant from URL and storage match');
        this.currentTenantSubject.next(storedTenant);
      }
    } else {
      const storedTenant = this.getStoredTenant();
      console.log('TenantService: Stored tenant (no URL):', storedTenant);
      if (storedTenant) {
        console.log('TenantService: Setting tenant from storage');
        this.currentTenantSubject.next(storedTenant);
      }
    }
  }

  private getTenantIdFromUrl(): string | null {
    const tenantId = this.route.snapshot.queryParams['tenantId'];
    return tenantId ? tenantId : null;
  }

  private updateUrlWithTenantId(tenantId: string): void {
    const currentUrl = this.router.url.split('?')[0];
    const queryParams = { ...this.route.snapshot.queryParams, tenantId: tenantId };
    this.router.navigate([currentUrl], { queryParams, replaceUrl: true });
  }

  private removeTenantIdFromUrl(): void {
    const currentUrl = this.router.url.split('?')[0];
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['tenantId'];
    this.router.navigate([currentUrl], { queryParams, replaceUrl: true });
  }

  private getStoredTenant(): UserTenants | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored tenant:', error);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  private storeTenant(tenant: UserTenants): void {
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
    this.isInitializing = false;
  }

  getCurrentTenantLanguage(): string | null {
    const tenant = this.getCurrentTenant();
    return tenant?.language || null;
  }

  resetInitialization(): void {
    console.log('TenantService: Resetting initialization state');
    this.isInitializing = false;
  }

  getUserTenantsFromApi(): Observable<UserTenantsResponse> {
    return this.apiService.getUserTenants();
  }

  async getUserTenantsAsync(): Promise<UserTenantsResponse> {
    return firstValueFrom(this.apiService.getUserTenants());
  }

  async createTenant(tenantData: CreateTenant): Promise<CreateTenantResponse> {
    try {
      const response = await firstValueFrom(this.apiService.createTenant(tenantData));
      if (response?.success && response.data) {
        await this.refreshUserTenants();
        this.selectTenant(response.data.tenant as UserTenants);
        return response;
      }
      throw new Error('Failed to create tenant');
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }
}
