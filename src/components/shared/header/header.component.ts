import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { SqlUserService } from '../../../services/sql-user.service';
import { LocaleService } from '../../../services/locale.service';
import { ApiService } from '../../../services/api.service';
import { FilterService } from '../../../services/filter.service';
import { FilterConfigService } from '../../../services/filter-config.service';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../../models/user';
import { Tenant, UserTenants } from '../../../models/tenant';
import { firstValueFrom, Observable } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../../services/tenant.service';
import { NAVIGATION_CONFIG, NavigationSection } from '../../../config/navigation.config';
import { PermissionService } from '../../../services/permission.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() toggleSideNav = new EventEmitter<void>();
  
  public currentUser: User | null = null;
  public currentTenant: UserTenants | null = null;
  public userTenants: UserTenants[] = [];
  public profile_picture_url: string | null = null;
  public showNavigation: boolean = true;
  public isLoggedIn: boolean = false;
  public currentLocale: string = 'en';
  public tenantSearchTerm: string = '';
  public filteredTenants: UserTenants[] = [];
  public hasFilters: boolean = false;
  public isMobileSidebarOpen: boolean = false;
  public mobileNavigationConfig: NavigationSection[] = [];
  public expandedSections: { [key: string]: boolean } = {};

  constructor(
    public themeService: ThemeService, 
    private authService: AuthService, 
    private sqlUserService: SqlUserService,
    private localeService: LocaleService,
    private apiService: ApiService,
    private router: Router,
    private tenantService: TenantService,
    private filterService: FilterService,
    private filterConfigService: FilterConfigService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef
  ) {
    this.localeService.currentLocale$.subscribe(locale => {
      this.currentLocale = locale;
    });
  }

  async ngOnInit(): Promise<void> {
    this.authService.authState$.subscribe((user: FirebaseUser | null) => {
      this.profile_picture_url = user ? (user as any).photoURL || null : null;
    });
    
    // Subscribe to current user changes instead of calling checkUserAndLogin directly
    this.sqlUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      
      // Load tenants when user changes
      if (user) {
        this.loadUserTenants();
      } else {
        this.userTenants = [];
        this.filteredTenants = [];
        this.currentTenant = null;
      }
    });

    this.tenantService.currentTenant$.subscribe((tenant) => {
      this.currentTenant = tenant;
    });

    // Only call checkUserAndLogin if we don't have a user yet
    if (!this.sqlUserService.getCurrentUserValue()) {
      await this.loadUser();
    } else {
      // If user is already loaded, try to restore selected tenant
      this.restoreSelectedTenant();
    }

    // Load mobile navigation config
    this.loadMobileNavigationConfig();
    
  }

  ngAfterViewInit(): void {
    // Initial filter visibility check - runs after view is fully initialized
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.updateFilterVisibility();
    });
    
    // Track route changes to update filter visibility after DOM is loaded
    this.router.events.subscribe(() => {
      setTimeout(() => {
        this.updateFilterVisibility();
      });
    });
  }

  private async loadUser(): Promise<void> {
    try {
      this.currentUser = await this.sqlUserService.checkUserAndLogin();
      this.isLoggedIn = !!this.currentUser;
    } catch (error) {
      console.error('Error loading user:', error);
      this.currentUser = null;
      this.isLoggedIn = false;
    }
  }

  private async loadUserTenants(): Promise<void> {
    try {
      
      if(this.currentUser?.tenants) {
        this.userTenants = this.currentUser.tenants;
        this.filteredTenants = this.currentUser.tenants;
      }
    } catch (error) {
      console.error('Error loading user tenants:', error);
      this.userTenants = [];
      this.filteredTenants = [];
    }
  }

  private restoreSelectedTenant(): void {
    try {
      const storedTenant = localStorage.getItem('selectedTenant');
      if (storedTenant) {
        const tenant = JSON.parse(storedTenant);
        // Verify the tenant is still in the user's tenants list
        if (this.userTenants.some(t => t.id === tenant.id)) {
          this.currentTenant = tenant;
        }
      }
    } catch (error) {
      console.error('Error restoring selected tenant:', error);
      localStorage.removeItem('selectedTenant');
    }
  }

  signOut(): void {
    this.authService.logout();
    this.sqlUserService.clearCurrentUser();
    this.currentUser = null;
    this.isLoggedIn = false;
    this.currentTenant = null;
    this.userTenants = [];
    this.filteredTenants = [];
    localStorage.removeItem('selectedTenant');
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async signIn(): Promise<void> {
    try {
      await this.authService.login();
      await this.loadUser();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.localeService.getDirection();
  }

  isRTL(): boolean {
    return this.localeService.isRTL();
  }

  onTenantSearchChange(): void {
    if (!this.tenantSearchTerm.trim()) {
      this.filteredTenants = this.userTenants;
    } else {
      this.filteredTenants = this.userTenants.filter(tenant =>
        tenant.name?.toLowerCase().includes(this.tenantSearchTerm.toLowerCase()) || false
      );
    }
  }

  selectTenant(tenant: UserTenants): void {
    this.currentTenant = tenant;
    this.tenantSearchTerm = '';
    this.tenantService.selectTenant(tenant);
  }

  createNewOrganization(): void {
    this.router.navigate(['/tenant-create']);
  }

  manageOrganization(): void {
    this.router.navigate(['/tenant-selection']);
  }

  editOrganization(): void {
    if (this.currentTenant?.id) {
      this.router.navigate(['/crm/edit-tenant', this.currentTenant.id]);
    }
  }

  getTenantDisplayName(): string {
    return this.currentTenant?.name || 'Select Tenant';
  }

  onToggleSideNav(): void {
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
      this.toggleMobileSidebar();
    } else {
      this.toggleSideNav.emit();
    }
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

  onMobileSidebarClick(event: Event): void {
    // Prevent the dropdown from closing when clicking inside
    event.stopPropagation();
  }

  private loadMobileNavigationConfig(): void {
    this.mobileNavigationConfig = NAVIGATION_CONFIG.filter(section => 
      section.permissions?.every(permission => this.hasPermission(permission)) || true
    ).map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.permissions?.every(permission => this.hasPermission(permission)) || true
      )
    }));
    
    // Initialize expanded state for each section
    this.mobileNavigationConfig.forEach(section => {
      this.expandedSections[section.id] = section.expanded || false;
    });
  }

  private hasPermission(permission?: any): boolean {
    if (!permission) return true;
    // For now, return true - you can implement proper permission checking later
    return true;
  }

  toggleMobileSection(sectionId: string): void {
    this.expandedSections[sectionId] = !this.expandedSections[sectionId];
  }

  isMobileSectionExpanded(sectionId: string): boolean {
    return this.expandedSections[sectionId];
  }

  onMobileNavigationClick(event: Event): void {
    event.stopPropagation();
    // Close mobile sidebar after navigation
    this.closeMobileSidebar();
  }

  onToggleFilters(): void {
    this.filterService.toggleFilters();
  }

  private updateFilterVisibility(): void {
    const currentUrl = this.router.url;
    const routePath = this.extractRoutePathFromUrl(currentUrl);
    
    console.log('Current URL:', currentUrl);
    console.log('Extracted route path:', routePath);
    
    if (routePath) {
      const combinedFilters = this.filterConfigService.getCombinedFiltersForRoute(routePath);
      this.hasFilters = combinedFilters.length > 0;
      console.log('Combined filters for route:', combinedFilters);
      console.log('Has filters:', this.hasFilters);
      
      // If filters are available, restore the saved state
      if (this.hasFilters) {
        const savedState = this.getSavedFilterState();
        this.filterService.setShowFilters(savedState);
        console.log('Restored saved filter state:', savedState);
      }
    } else {
      this.hasFilters = false;
      console.log('No route path found, hasFilters set to false');
    }

    if(!this.hasFilters) {
      this.filterService.setShowFilters(false);
      console.log('No filters found for route:', routePath, '- forcing filters to close');
      // Trigger change detection to ensure the UI updates
      this.cdr.detectChanges();
    }
  }

  private getSavedFilterState(): boolean {
    try {
      const saved = localStorage.getItem('showFilters');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error reading saved filter state:', error);
      return false;
    }
  }

  private extractRoutePathFromUrl(url: string): string | null {
    const path = url.split('?')[0];
    
    // Extract the path after /crm/
    const crmIndex = path.indexOf('/crm/');
    if (crmIndex === -1) {
      return null;
    }
    
    const routePath = path.substring(crmIndex + 5); // +5 to skip '/crm/'
    const routeSegments = routePath.split('/').filter(segment => segment.length > 0);
    const baseRoute = routeSegments[0];
    
    // Only return base route if it's exactly the base route (no additional segments)
    return routeSegments.length === 1 ? baseRoute : null;
  }
}
