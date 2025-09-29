import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';

import { AuthService, SqlUserService } from '../../../../services';
import { User } from '../../../../models';
import { User as FirebaseUser, updateEmail, sendEmailVerification } from '@angular/fire/auth';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Input() currentUser: User | null = null;
  @Input() firebaseUser: FirebaseUser | null = null;
  
  updating = false;
  
  // Forms
  emailForm: FormGroup;
  languageForm: FormGroup;
  
  // State flags
  isEmailVerified = false;
  isEmailUpdateSent = false;
  
  constructor(
    private authService: AuthService,
    private sqlUserService: SqlUserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.emailForm = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
    
    this.languageForm = this.formBuilder.group({
      language: ['en', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    this.subscribeToAuthState();
    this.populateLanguageForm();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnChanges(): void {
    if (this.currentUser) {
      this.populateLanguageForm();
    }
  }
  
  private subscribeToAuthState(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(firebaseUser => {
        this.firebaseUser = firebaseUser;
        this.isEmailVerified = firebaseUser?.emailVerified || false;
      });
  }
  
  private populateLanguageForm(): void {
    if (this.currentUser) {
      this.languageForm.patchValue({
        language: this.currentUser.language || 'en'
      });
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
