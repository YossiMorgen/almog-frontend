import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TenantService } from '../../../../services/tenant.service';
import { CreateTenant, CreateTenantResponse } from '../../../../models/tenant';
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

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      domain: ['', [Validators.maxLength(100)]],
      language: ['he', [Validators.pattern(/^en|he$/)]],
      subdomain: ['', [Validators.maxLength(50)]]
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
      console.log('formData');
      

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
    } else {
      this.markFormGroupTouched();
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
