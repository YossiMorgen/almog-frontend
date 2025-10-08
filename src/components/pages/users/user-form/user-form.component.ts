import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { RolesService } from '../../../../services/roles.service';
import { InvitationService } from '../../../../services/invitation.service';
import { User, CreateUser, UpdateUser } from '../../../../models/user';
import { Role } from '../../../../models/role';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { TenantService } from '../../../../services';
import { ConfirmationDialogService } from '../../../../services/confirmation-dialog.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTabsModule
  ],
  providers: [UsersService, RolesService, InvitationService],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  userId: number | null = null;
  availableRoles: Role[] = [];
  selectedRoles: number[] = [];
  isEditMode: boolean = false;
  
  private destroy$ = new Subject<void>();

  userForm!: FormGroup;
  settingsJson: string = '{}';

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private invitationService: InvitationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private tenantService: TenantService,
    private confirmationDialog: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUser();
      } else {
        this.isEditMode = false;
      }
    });

    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      display_name: [''],
      phone: [''],
      profile_picture_url: [''],
      language: ['en']
    });


    this.loadAvailableRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async loadAvailableRoles(): Promise<void> {
    try {
      const response = await this.rolesService.getRolesAsync();
      this.availableRoles = response.data.data || [];
    } catch (error) {
      console.error('Error loading roles:', error);
      this.error = 'Failed to load available roles';
    }
  }


  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getUser(this.userId).subscribe({
      next: async (response: any) => {
        const userData = response.data;
        this.userForm.patchValue({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          display_name: userData.display_name,
          profile_picture_url: userData.profile_picture_url,
          phone: userData.phone,
          language: userData.language || 'en'
        });
        this.settingsJson = JSON.stringify(userData.settings || {}, null, 2);
        
        // Load user roles
        try {
          const tenantId = this.tenantService.getCurrentTenantId()!;
          const rolesResponse = await this.usersService.getUserRoles(this.userId!, tenantId).toPromise();
          if (rolesResponse?.success && rolesResponse.data?.roles) {
            this.selectedRoles = rolesResponse.data.roles.map((role: any) => role.id);
          }
        } catch (error) {
          console.error('Error loading user roles:', error);
        }
        
        this.userForm.markAsPristine();
        this.userForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load user';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  onRoleToggle(roleId: number): void {
    const index = this.selectedRoles.indexOf(roleId);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(roleId);
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoles.includes(roleId);
  }

  getRoleName(roleId: number): string {
    const role = this.availableRoles.find(r => r.id === roleId);
    return role ? role.name : `Role ${roleId}`;
  }


  private async showConfirmationDialog(title: string, subtitle: string): Promise<boolean> {
    const result = await this.confirmationDialog.confirm(title, subtitle).toPromise();
    return result ?? false;
  }



  async submitForm(): Promise<void> {
    this.userForm.markAllAsTouched();
    
    if (!this.userForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }

    if (this.selectedRoles.length === 0) {
      this.error = 'Please select at least one role';
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.userForm.value;
      
      let settings = {};
      try {
        settings = JSON.parse(this.settingsJson);
      } catch (error) {
        this.error = 'Invalid JSON in settings field';
        return;
      }

      if (this.isEditMode) {
        // Update existing user
        const updatePayload: UpdateUser = {
          email: formValue.email,
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          display_name: formValue.display_name,
          profile_picture_url: formValue.profile_picture_url,
          phone: formValue.phone,
          language: formValue.language,
          settings: settings
        };
        
        await this.usersService.updateUserAsync(this.userId!, updatePayload);
        
        // Update user roles separately
        const tenantId = this.tenantService.getCurrentTenantId()!;
        await this.usersService.updateUserRoles(this.userId!, this.selectedRoles, tenantId).toPromise();
      } else {
        // Show confirmation dialog for new invitation
        const confirmed = await this.showConfirmationDialog(
          'Send Invitation',
          `Are you sure you want to send an invitation to ${formValue.email} with the selected roles?`
        );
        
        if (!confirmed) {
          this.loading = false;
          return;
        }
        
        // Create invitation
        await this.createInvitation(formValue.email, this.selectedRoles);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/users']);
    } catch (error: any) {
      console.error('Error saving user:', error);
      this.error = this.userId ? 'Failed to update user' : 'Failed to create user';
    } finally {
      this.loading = false;
    }
  }

  private async createInvitation(email: string, roles: number[]): Promise<void> {
    try {
      const invitationData = {
        invited_email: email,
        invited_roles: roles,
        expires_days: 7
      };

      const response = await this.invitationService.createInvitationAsync(invitationData);
      console.log('Invitation created successfully:', response);
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.userForm.reset();
    this.userId = null;
    this.selectedRoles = [];
    this.isEditMode = false;
  }

  onCancel(): void {
    this.router.navigate(['/crm/users']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control && control.invalid) {
        const controlErrors = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(errorKey => {
            errors.push(`Control '${key}' has error: ${errorKey}`);
          });
        }
      }
    });
    return errors.join('\n');
  }

  // Example methods showing different ways to use the confirmation dialog service

  // Method 1: Using async/await (recommended for sequential operations)
  async deleteUserExample(): Promise<void> {
    const confirmed = await this.confirmationDialog.confirm(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.'
    ).toPromise();
    
    if (confirmed) {
      console.log('User confirmed deletion');
      // Perform deletion logic here
    } else {
      console.log('User cancelled deletion');
    }
  }

  // Method 2: Using subscribe (good for reactive programming)
  resetFormWithConfirmation(): void {
    this.confirmationDialog.confirm(
      'Reset Form',
      'Are you sure you want to reset the form? All unsaved changes will be lost.'
    ).subscribe(result => {
      if (result) {
        this.resetForm();
        console.log('Form reset confirmed');
      } else {
        console.log('Form reset cancelled');
      }
    });
  }

  // Method 3: Using firstValueFrom (modern RxJS approach)
  async saveWithConfirmation(): Promise<void> {
    try {
      const confirmed = await this.confirmationDialog.confirm(
        'Save Changes',
        'Do you want to save your changes?'
      ).pipe().toPromise();
      
      if (confirmed) {
        // Perform save logic here
        console.log('Changes saved');
      }
    } catch (error) {
      console.error('Error during confirmation:', error);
    }
  }
}

