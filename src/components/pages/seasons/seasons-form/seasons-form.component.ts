import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeasonsService } from '../../../../services/seasons.service';
import { Season, CreateSeason, UpdateSeason } from '../../../../models/season';
import { ToastifyNotificationsService } from '../../../../services/toastify-notifications.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-seasons-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  providers: [SeasonsService, ToastifyNotificationsService],
  templateUrl: './seasons-form.component.html',
  styleUrls: ['./seasons-form.component.scss']
})
export class SeasonsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  seasonId: number | null = null;
  currentUser: any = null;
  error: string | null = null;

  seasonForm!: FormGroup;

  private endDateValidator(control: AbstractControl): ValidationErrors | null {
    const endDate = control.value;
    const startDate = this.seasonForm?.get('start_date')?.value;
    
    if (startDate && endDate && startDate >= endDate) {
      return { dateRange: true };
    }
    return null;
  }

  private registrationEndDateValidator(control: AbstractControl): ValidationErrors | null {
    const regEndDate = control.value;
    const regStartDate = this.seasonForm?.get('registration_start_date')?.value;
    
    if (regStartDate && regEndDate && regStartDate >= regEndDate) {
      return { registrationDateRange: true };
    }
    return null;
  }

  getDateRangeError(): string | null {
    const endDateControl = this.seasonForm.get('end_date');
    if (endDateControl?.hasError('dateRange')) {
      return 'End date must be after start date';
    }
    return null;
  }

  getRegistrationDateRangeError(): string | null {
    const regEndDateControl = this.seasonForm.get('registration_end_date');
    if (regEndDateControl?.hasError('registrationDateRange')) {
      return 'Registration end date must be after registration start date';
    }
    return null;
  }

  constructor(
    private seasonsService: SeasonsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastifyService: ToastifyNotificationsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.seasonId = +params['id'];
        this.loadSeason();
      }
    });

    this.seasonForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(3000)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required, this.endDateValidator.bind(this)]],
      is_active: [!this.seasonId],
      registration_start_date: [''],
      registration_end_date: ['', this.registrationEndDateValidator.bind(this)]
    });

    // Trigger validation when start date changes
    this.seasonForm.get('start_date')?.valueChanges.subscribe(() => {
      this.seasonForm.get('end_date')?.updateValueAndValidity();
    });

    // Trigger validation when registration start date changes
    this.seasonForm.get('registration_start_date')?.valueChanges.subscribe(() => {
      this.seasonForm.get('registration_end_date')?.updateValueAndValidity();
    });
  }

  loadSeason(): void {
    if (!this.seasonId) return;

    this.loading = true;
    this.seasonsService.getSeason(this.seasonId).subscribe({
      next: (response: any) => {
        const seasonData = response.data;
        this.seasonForm.patchValue({
          name: seasonData.name,
          year: seasonData.year,
          start_date: seasonData.start_date ? new Date(seasonData.start_date) : '',
          end_date: seasonData.end_date ? new Date(seasonData.end_date) : '',
          is_active: seasonData.is_active || false,
          registration_start_date: seasonData.registration_start_date ? new Date(seasonData.registration_start_date) : '',
          registration_end_date: seasonData.registration_end_date ? new Date(seasonData.registration_end_date) : ''
        });
        this.seasonForm.markAsPristine();
        this.seasonForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.toastifyService.error('Failed to load season');
        this.loading = false;
        console.error('Error loading season:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.seasonForm.markAllAsTouched();
    
    if (!this.seasonForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;

    try {
      const formValue = this.seasonForm.value;
      
      if (this.seasonId) {
        const updatePayload: UpdateSeason = {
          name: formValue.name,
          year: formValue.year,
          start_date: formValue.start_date ? new Date(formValue.start_date) : undefined,
          end_date: formValue.end_date ? new Date(formValue.end_date) : undefined,
          is_active: formValue.is_active,
          registration_start_date: formValue.registration_start_date ? new Date(formValue.registration_start_date) : undefined,
          registration_end_date: formValue.registration_end_date ? new Date(formValue.registration_end_date) : undefined
        };
        
        await this.seasonsService.updateSeasonAsync(this.seasonId, updatePayload);
        this.toastifyService.success('Season updated successfully!');
        this.resetForm();
        this.router.navigate(['/crm/seasons']);
      } else {
        const createPayload: CreateSeason = {
          name: formValue.name!,
          year: formValue.year!,
          start_date: new Date(formValue.start_date!),
          end_date: new Date(formValue.end_date!),
          is_active: formValue.is_active || false,
          registration_start_date: formValue.registration_start_date ? new Date(formValue.registration_start_date) : undefined,
          registration_end_date: formValue.registration_end_date ? new Date(formValue.registration_end_date) : undefined
        };
        
        const response = await this.seasonsService.createSeasonAsync(createPayload);
        this.toastifyService.success('Season created successfully!');
        this.resetForm();
        
        // Navigate to courses with the new season ID
        if (response.data && response.data.id) {
          this.router.navigate(['/crm/courses'], { queryParams: { season_id: response.data.id } });
        } else {
          this.router.navigate(['/crm/seasons']);
        }
      }
    } catch (error: any) {
      console.error('Error saving season:', error);
      this.toastifyService.error(this.seasonId ? 'Failed to update season' : 'Failed to create season');
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.seasonForm.reset();
    this.seasonId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/seasons']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.seasonForm.controls).forEach(key => {
      const control = this.seasonForm.get(key);
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
