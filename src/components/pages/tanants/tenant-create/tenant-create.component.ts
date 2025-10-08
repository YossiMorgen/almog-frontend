import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TenantService } from '../../../../services/tenant.service';
import { CreateTenant, CreateTenantResponse, UserTenants } from '../../../../models/tenant';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-tenant-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatSelectModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './tenant-create.component.html',
  styleUrls: ['./tenant-create.component.scss']
})
export class TenantCreateComponent implements OnInit {
  tenantForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  isEditMode = false;
  tenantId: string | null = null;
  currentTenant: UserTenants | null = null;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      domain: ['', [Validators.maxLength(100)]],
      language: ['he', [Validators.pattern(/^en|he$/)]],
      subdomain: ['', [Validators.maxLength(50)]]
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.tenantId = params['id'];
        this.loadTenantForEdit();
      }
    });
  }

  onSubmit(): void {
    if (this.tenantForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;

      const formData: CreateTenant = {
        name: this.tenantForm.value.name.trim(),
        domain: this.tenantForm.value.domain?.trim() || undefined,
        subdomain: this.tenantForm.value.subdomain?.trim() || undefined,
        language: this.tenantForm.value.language?.trim() || undefined,
        settings: {}
      };

      if (this.isEditMode && this.tenantId) {
        this.updateTenant(formData);
      } else {
        this.createTenant(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createTenant(formData: CreateTenant): void {
    this.tenantService.createTenant(formData)
      .then((response: CreateTenantResponse) => {
        this.tenantService.selectTenant(response.data.tenant);
        this.router.navigate(['/crm'], { queryParams: { tenantId: response.data.tenant.id } });
      })
      .catch((error: any) => {
        console.error('Error creating tenant:', error);
        this.error = error.error?.error || 'Failed to create organization. Please try again.';
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  private updateTenant(formData: CreateTenant): void {
    // For now, we'll show an error since updateTenant doesn't exist yet
    // TODO: Implement updateTenant method in tenant service
    this.error = 'Update functionality is not yet implemented. Please contact support.';
    this.isSubmitting = false;
  }

  private loadTenantForEdit(): void {
    if (!this.tenantId) return;
    
    // Get current tenant from tenant service
    this.currentTenant = this.tenantService.getCurrentTenant();
    
    if (this.currentTenant && this.currentTenant.id === this.tenantId) {
      // Populate form with current tenant data
      this.tenantForm.patchValue({
        name: this.currentTenant.name,
        domain: this.currentTenant.domain || '',
        subdomain: this.currentTenant.subdomain || '',
        language: this.currentTenant.language || 'he'
      });
    } else {
      // If tenant not found, redirect to tenant selection
      this.router.navigate(['/tenant-selection']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/tenant-selection']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.tenantForm.controls).forEach(key => {
      const control = this.tenantForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.tenantForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must be no more than ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Organization Name',
      domain: 'Domain',
      subdomain: 'Subdomain'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tenantForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
