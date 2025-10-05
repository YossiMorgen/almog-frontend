import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormGroupDirective, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';

@Component({
  selector: 'app-classes-locations-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './classes-locations-form.component.html',
  styleUrls: ['./classes-locations-form.component.scss']
})
export class ClassesLocationsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  locationId: number | null = null;

  locationForm!: FormGroup;

  constructor(
    private classesLocationsService: ClassesLocationsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.locationId = +params['id'];
        this.loadLocation();
      }
    });

    this.initializeForm();
  }

  initializeForm(): void {
    this.locationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      address: [''],
      city: [''],
      postal_code: [''],
      phone: [''],
      email: ['', [Validators.email]],
      capacity: [0, [Validators.required, Validators.min(0)]],
      is_active: [true]
    });
  }

  loadLocation(): void {
    if (!this.locationId) return;

    this.loading = true;
    this.error = null;

    this.classesLocationsService.getClassesLocation(this.locationId).subscribe({
      next: (response: any) => {
        const locationData = response.data;
        this.locationForm.patchValue({
          name: locationData.name,
          description: locationData.description,
          address: locationData.address,
          city: locationData.city,
          postal_code: locationData.postal_code,
          phone: locationData.phone,
          email: locationData.email,
          capacity: locationData.capacity,
          is_active: locationData.is_active
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load location details';
        this.loading = false;
        console.error('Error loading location:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = {
        ...this.locationForm.value
      };

      const operation = this.locationId 
        ? this.classesLocationsService.updateClassesLocation(this.locationId, formData)
        : this.classesLocationsService.createClassesLocation(formData);

      operation.subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigate(['/crm/classes-locations']);
        },
        error: (error: any) => {
          this.error = this.locationId ? 'Failed to update location' : 'Failed to create location';
          this.loading = false;
          console.error('Error saving location:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/crm/classes-locations']);
  }

  getFieldError(fieldName: string): string {
    const field = this.locationForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${field.errors?.['min'].min}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      description: 'Description',
      address: 'Address',
      city: 'City',
      postal_code: 'Postal Code',
      phone: 'Phone',
      email: 'Email',
      capacity: 'Capacity'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.locationForm.controls).forEach(key => {
      const control = this.locationForm.get(key);
      control?.markAsTouched();
    });
  }
}
