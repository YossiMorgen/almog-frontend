import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { SqlUserService } from '../../../services/sql-user.service';
import { LocaleService } from '../../../services/locale.service';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../../models/user';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatToolbarModule  ,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public currentUser: User | null = null;
  public profile_picture_url: string | null = null;
  public showNavigation: boolean = true;
  public isLoggedIn: boolean = false;
  public currentLocale: string = 'en';

  constructor(
    public themeService: ThemeService, 
    private authService: AuthService, 
    private sqlUserService: SqlUserService,
    private localeService: LocaleService,
    private router: Router
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
    });

    // Only call checkUserAndLogin if we don't have a user yet
    if (!this.sqlUserService.getCurrentUserValue()) {
      await this.loadUser();
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

  signOut(): void {
    this.authService.logout();
    this.sqlUserService.clearCurrentUser();
    this.currentUser = null;
    this.isLoggedIn = false;
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
}
