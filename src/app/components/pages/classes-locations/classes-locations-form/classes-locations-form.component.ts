import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';
import { ClassesLocation, CreateClassesLocation, UpdateClassesLocation } from '../../../../models/classesLocation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-classes-locations-form',
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
    MatChipsModule,
    MatCheckboxModule
  ],
  providers: [ClassesLocationsService],
  templateUrl: './classes-locations-form.component.html',
  styleUrls: ['./classes-locations-form.component.scss']
})
export class ClassesLocationsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  locationId: number | null = null;
  isEditMode = false;
  form: FormGroup;
  newFacility = '';

  constructor(
    private fb: FormBuilder,
    private classesLocationsService: ClassesLocationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      address: [''],
      city: ['', [Validators.maxLength(100)]],
      postal_code: ['', [Validators.maxLength(20)]],
      phone: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email]],
      capacity: [0, [Validators.min(0)]],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.locationId = +params['id'];
        this.isEditMode = true;
        this.loadLocation();
      }
    });
  }

  loadLocation(): void {
    if (!this.locationId) return;
    
    this.loading = true;
    this.classesLocationsService.getClassesLocation(this.locationId).subscribe({
      next: (response : any) => {
        const location = response.data;
        this.form.patchValue(location);
        this.loading = false;
      },
      error: (error : any) => {
        this.error = 'Failed to load location';
        this.loading = false;
        console.error('Error loading location:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const formData = {
        ...this.form.value,
      };

      if (this.isEditMode && this.locationId) {
        this.classesLocationsService.updateClassesLocation(this.locationId, formData).subscribe({
          next: (response : any) => {
            this.loading = false;
            this.router.navigate(['/crm/classes-locations']);
          },
          error: (error : any) => {
            this.error = 'Failed to update location';
            this.loading = false;
            console.error('Error updating location:', error);
          }
        });
      } else {
        this.classesLocationsService.createClassesLocation(formData).subscribe({
          next: (response : any) => {
            this.loading = false;
            this.router.navigate(['/crm/classes-locations']);
          },
          error: (error : any) => {
            this.error = 'Failed to create location';
            this.loading = false;
            console.error('Error creating location:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/crm/classes-locations']);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['min']) return `${fieldName} must be positive`;
    }
    return '';
  }
}
