import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService } from '../../../../services/permissions.service';
import { Permission, CreatePermission, UpdatePermission } from '../../../../models/permission';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-permissions-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [PermissionsService],
  templateUrl: './permissions-form.component.html',
  styleUrls: ['./permissions-form.component.scss']
})
export class PermissionsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  permissionId: number | null = null;

  permissionForm!: FormGroup;

  constructor(
    private permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.permissionId = +params['id'];
        this.loadPermission();
      }
    });

    this.permissionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      module: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      action: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['']
    });
  }

  loadPermission(): void {
    if (!this.permissionId) return;

    this.loading = true;
    this.permissionsService.getPermission(this.permissionId).subscribe({
      next: (response: any) => {
        const permissionData = response.data;
        this.permissionForm.patchValue({
          name: permissionData.name,
          module: permissionData.module,
          action: permissionData.action,
          description: permissionData.description
        });
        this.permissionForm.markAsPristine();
        this.permissionForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load permission';
        this.loading = false;
        console.error('Error loading permission:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.permissionForm.markAllAsTouched();
    
    if (!this.permissionForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.permissionForm.value;
      
      if (this.permissionId) {
        const updatePayload: UpdatePermission = {
          name: formValue.name,
          module: formValue.module,
          action: formValue.action,
          description: formValue.description
        };
        
        await this.permissionsService.updatePermissionAsync(this.permissionId, updatePayload);
      } else {
        const createPayload: CreatePermission = {
          name: formValue.name!,
          module: formValue.module!,
          action: formValue.action!,
          description: formValue.description
        };
        
        await this.permissionsService.createPermissionAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/permissions']);
    } catch (error: any) {
      console.error('Error saving permission:', error);
      this.error = this.permissionId ? 'Failed to update permission' : 'Failed to create permission';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.permissionForm.reset();
    this.permissionId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/permissions']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.permissionForm.controls).forEach(key => {
      const control = this.permissionForm.get(key);
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
}

