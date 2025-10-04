import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { SqlUserService } from '../../../services/sql-user.service';
import { LocaleService } from '../../../services/locale.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../../models/user';
import { Tenant, UserTenants } from '../../../models/tenant';
import { firstValueFrom } from 'rxjs';
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
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
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
export class HeaderComponent {
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

  constructor(
    public themeService: ThemeService, 
    private authService: AuthService, 
    private sqlUserService: SqlUserService,
    private localeService: LocaleService,
    private apiService: ApiService,
    private router: Router,
    private tenantService: TenantService
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

    // Only call checkUserAndLogin if we don't have a user yet
    if (!this.sqlUserService.getCurrentUserValue()) {
      await this.loadUser();
    } else {
      // If user is already loaded, try to restore selected tenant
      this.restoreSelectedTenant();
    }
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

  getTenantDisplayName(): string {
    return this.currentTenant?.name || 'Select Tenant';
  }

  onToggleSideNav(): void {
    this.toggleSideNav.emit();
  }
}
