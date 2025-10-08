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
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';

import { SqlUserService } from '../../../../services';
import { User } from '../../../../models';

@Component({
  selector: 'app-profile-information',
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
    MatChipsModule
  ],
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Input() currentUser: User | null = null;
  
  loading = false;
  updating = false;
  
  // Forms
  profileForm: FormGroup;
  
  // Display data
  userRoles: string[] = [];
  userPermissions: string[] = [];
  
  constructor(
    private sqlUserService: SqlUserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.maxLength(200)]],
      last_name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    this.populateForms();
    this.extractUserRolesAndPermissions();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnChanges(): void {
    if (this.currentUser) {
      this.populateForms();
      this.extractUserRolesAndPermissions();
    }
  }
  
  private populateForms(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.first_name + ' ' + this.currentUser.last_name || '',
        email: this.currentUser.email || '',
        first_name: this.currentUser.first_name || '',
        last_name: this.currentUser.last_name || ''
      });
    }
  }
  
  private extractUserRolesAndPermissions(): void {
    if (this.currentUser) {
      console.log('currentUser', this.currentUser);
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
        first_name: formData.first_name,
        last_name: formData.last_name,
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
