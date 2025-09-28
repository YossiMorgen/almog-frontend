import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { SqlUserService } from '../../../services/sql-user.service';
import { User } from '../../../models/user';
import { User as FirebaseUser, GoogleAuthProvider, updateEmail, sendEmailVerification, deleteUser } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    MatSelectModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  firebaseUser: FirebaseUser | null = null;
  loading = false;
  updating = false;
  
  // Forms
  profileForm: FormGroup;
  emailForm: FormGroup;
  languageForm: FormGroup;
  
  // State flags
  isEmailVerified = false;
  isEmailUpdateSent = false;
  
  // Display data
  userRoles: string[] = [];
  userPermissions: string[] = [];
  
  constructor(
    private authService: AuthService,
    private sqlUserService: SqlUserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]]
    });
    
    this.emailForm = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
    
    this.languageForm = this.formBuilder.group({
      language: ['en', [Validators.required]]
    });
  }
  
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
        this.populateForms();
        this.extractUserRolesAndPermissions();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.showError('Failed to load user data');
    } finally {
      this.loading = false;
    }
  }
  
  private populateForms(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name || '',
        email: this.currentUser.email || ''
      });
      
      this.languageForm.patchValue({
        language: this.currentUser.language || 'en'
      });
    }
  }
  
  private extractUserRolesAndPermissions(): void {
    if (this.currentUser) {
      this.userRoles = this.currentUser.roles?.map(role => role.name) || [];
      this.userPermissions = this.currentUser.permissions?.map(permission => permission.name) || [];
    }
  }
  
  
  async updateProfile(): Promise<void> {
    if (this.profileForm.invalid || !this.currentUser) return;
    
    this.updating = true;
    try {
      const formData = this.profileForm.value;
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      const response = await this.sqlUserService.updateUser(this.currentUser.id!, updateData).toPromise();
      
      if (response?.success) {
        this.currentUser = response.data;
        this.sqlUserService.setCurrentUser(this.currentUser);
        this.showSuccess('Profile updated successfully');
      } else {
        this.showError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showError('Failed to update profile');
    } finally {
      this.updating = false;
    }
  }
  
  
  async sendEmailVerification(): Promise<void> {
    if (!this.firebaseUser) return;
    
    try {
      await sendEmailVerification(this.firebaseUser);
      this.showSuccess('Verification email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      this.showError(this.getFirebaseErrorMessage(error));
    }
  }
  
  async updateEmail(): Promise<void> {
    if (this.emailForm.invalid || !this.firebaseUser) return;
    
    this.updating = true;
    try {
      const { newEmail } = this.emailForm.value;
      
      // Update email in Firebase
      await updateEmail(this.firebaseUser, newEmail);
      
      // Send verification email
      await sendEmailVerification(this.firebaseUser);
      
      this.showSuccess('Email updated successfully. Please verify your new email.');
      this.isEmailUpdateSent = true;
      this.emailForm.reset();
    } catch (error: any) {
      console.error('Error updating email:', error);
      this.showError(this.getFirebaseErrorMessage(error));
    } finally {
      this.updating = false;
    }
  }
  
  async updateLanguage(): Promise<void> {
    if (this.languageForm.invalid || !this.currentUser) return;
    
    this.updating = true;
    try {
      const { language } = this.languageForm.value;
      
      const response = await this.sqlUserService.updateUser(this.currentUser.id!, { language }).toPromise();
      
      if (response?.success) {
        this.currentUser = response.data;
        this.sqlUserService.setCurrentUser(this.currentUser);
        this.showSuccess('Language preference updated successfully');
        
        // Reload the page to apply the new language
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        this.showError('Failed to update language preference');
      }
    } catch (error) {
      console.error('Error updating language:', error);
      this.showError('Failed to update language preference');
    } finally {
      this.updating = false;
    }
  }
  
  
  async deleteAccount(): Promise<void> {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;
    
    this.updating = true;
    try {
      // Delete from backend
      if (this.currentUser?.id) {
        await this.sqlUserService.deleteUser(this.currentUser.id).toPromise();
      }
      
      // Delete Firebase account
      if (this.firebaseUser) {
        await deleteUser(this.firebaseUser);
      }
      
      this.showSuccess('Account deleted successfully');
      await this.authService.logout();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      this.showError(this.getFirebaseErrorMessage(error));
    } finally {
      this.updating = false;
    }
  }
  
  
  private getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/requires-recent-login':
        return 'Please log in again to perform this action';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'User account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      default:
        return error.message || 'An error occurred';
    }
  }
  
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }
  
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  
  getProfileImageUrl(): string {
    return this.firebaseUser?.photoURL || this.currentUser?.picture || '/assets/default-avatar.png';
  }
  
  getDisplayName(): string {
    return this.currentUser?.name || this.firebaseUser?.displayName || 'User';
  }
  
  getEmail(): string {
    return this.currentUser?.email || this.firebaseUser?.email || '';
  }
  
  getAccountCreationDate(): string {
    if (this.firebaseUser?.metadata?.creationTime) {
      return new Date(this.firebaseUser.metadata.creationTime).toLocaleDateString();
    }
    if (this.currentUser?.createdAt) {
      return new Date(this.currentUser.createdAt).toLocaleDateString();
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
