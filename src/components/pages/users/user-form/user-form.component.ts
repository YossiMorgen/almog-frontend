import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { User, CreateUser, UpdateUser } from '../../../../models/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  providers: [UsersService],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  userId: number | null = null;

  userForm!: FormGroup;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.loadUser();
      }
    });

    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      picture: ['']
    });
  }

  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getUser(this.userId).subscribe({
      next: (response: any) => {
        const userData = response.data;
        this.userForm.patchValue({
          email: userData.email,
          name: userData.name,
          picture: userData.picture
        });
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

  async submitForm(): Promise<void> {
    this.userForm.markAllAsTouched();
    
    if (!this.userForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.userForm.value;
      
      if (this.userId) {
        const updatePayload: UpdateUser = {
          email: formValue.email,
          name: formValue.name,
          picture: formValue.picture
        };
        
        await this.usersService.updateUserAsync(this.userId, updatePayload);
      } else {
        const createPayload: CreateUser = {
          email: formValue.email!,
          name: formValue.name,
          picture: formValue.picture,
          language: 'en'
        };
        
        await this.usersService.createUserAsync(createPayload);
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

  resetForm(): void {
    this.formDirective.resetForm();
    this.userForm.reset();
    this.userId = null;
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
}

