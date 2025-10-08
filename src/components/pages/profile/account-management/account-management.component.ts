import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { AuthService, SqlUserService } from '../../../../services';
import { User } from '../../../../models';
import { User as FirebaseUser, deleteUser } from '@angular/fire/auth';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Input() currentUser: User | null = null;
  @Input() firebaseUser: FirebaseUser | null = null;
  
  updating = false;
  
  constructor(
    private authService: AuthService,
    private sqlUserService: SqlUserService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {}
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
  
  getEmailVerifiedStatus(): boolean {
    return this.firebaseUser?.emailVerified || false;
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
}
