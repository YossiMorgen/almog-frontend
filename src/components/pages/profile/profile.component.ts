import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';

import { AuthService, SqlUserService } from '../../../services';
import { User } from '../../../models';
import { User as FirebaseUser } from '@angular/fire/auth';

// Import sub-components
import { ProfileInformationComponent } from './profile-information/profile-information.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { ApiKeysManagementComponent } from './api-keys-management/api-keys-management.component';
import { AccountManagementComponent } from './account-management/account-management.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    ProfileInformationComponent,
    SecuritySettingsComponent,
    ApiKeysManagementComponent,
    AccountManagementComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  firebaseUser: FirebaseUser | null = null;
  loading = false;
  
  // State flags
  isEmailVerified = false;
  
  // Display data
  userRoles: string[] = [];
  userPermissions: string[] = [];
  
  constructor(
    private authService: AuthService,
    private sqlUserService: SqlUserService
  ) {}
  
  ngOnInit(): void {
    this.loadUserData();
    this.subscribeToAuthState();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private subscribeToAuthState(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(firebaseUser => {
        this.firebaseUser = firebaseUser;
        this.isEmailVerified = firebaseUser?.emailVerified || false;
      });
  }
  
  private async loadUserData(): Promise<void> {
    this.loading = true;
    try {
      // First check if we already have a user cached
      let user = this.sqlUserService.getCurrentUserValue();
      
      if (!user) {
        // Only call checkUserAndLogin if we don't have a cached user
        user = await this.sqlUserService.checkUserAndLogin();
      }
      
      if (user) {
        this.currentUser = user;
        this.extractUserRolesAndPermissions();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.loading = false;
    }
  }
  
  private extractUserRolesAndPermissions(): void {
    if (this.currentUser) {
      this.userRoles = this.currentUser.roles?.map(role => role.name) || [];
      this.userPermissions = this.currentUser.permissions?.map(permission => permission.name) || [];
    }
  }
  
  getProfileImageUrl(): string {
    return this.firebaseUser?.photoURL || this.currentUser?.profile_picture_url || '/assets/default-avatar.png';
  }
  
  getDisplayName(): string {
    return this.currentUser?.first_name + ' ' + this.currentUser?.last_name || this.firebaseUser?.displayName || 'User';
  }
  
  getEmail(): string {
    return this.currentUser?.email || this.firebaseUser?.email || '';
  }
  
  getAccountCreationDate(): string {
    if (this.firebaseUser?.metadata?.creationTime) {
      return new Date(this.firebaseUser.metadata.creationTime).toLocaleDateString();
    }
    if (this.currentUser?.created_at) {
      return new Date(this.currentUser.created_at).toLocaleDateString();
    }
    return 'Unknown';
  }
  
  getLastSignInDate(): string {
    if (this.firebaseUser?.metadata?.lastSignInTime) {
      return new Date(this.firebaseUser.metadata.lastSignInTime).toLocaleDateString();
    }
    return 'Unknown';
  }
}