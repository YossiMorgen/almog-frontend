import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles.service';
import { Role, CreateRole, UpdateRole } from '../../../../models/role';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [RolesService],
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  roleId: number | null = null;

  roleForm!: FormGroup;

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.roleId = +params['id'];
        this.loadRole();
      }
    });

    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  loadRole(): void {
    if (!this.roleId) return;

    this.loading = true;
    this.rolesService.getRole(this.roleId).subscribe({
      next: (response: any) => {
        const roleData = response.data;
        this.roleForm.patchValue({
          name: roleData.name,
          description: roleData.description
        });
        this.roleForm.markAsPristine();
        this.roleForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load role';
        this.loading = false;
        console.error('Error loading role:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.roleForm.markAllAsTouched();
    
    if (!this.roleForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.roleForm.value;
      
      if (this.roleId) {
        const updatePayload: UpdateRole = {
          name: formValue.name,
          description: formValue.description
        };
        
        await this.rolesService.updateRoleAsync(this.roleId, updatePayload);
      } else {
        const createPayload: CreateRole = {
          name: formValue.name!,
          is_system: false,
          description: formValue.description
        };
        
        await this.rolesService.createRoleAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/roles']);
    } catch (error: any) {
      console.error('Error saving role:', error);
      this.error = this.roleId ? 'Failed to update role' : 'Failed to create role';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.roleForm.reset();
    this.roleId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/roles']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.roleForm.controls).forEach(key => {
      const control = this.roleForm.get(key);
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


