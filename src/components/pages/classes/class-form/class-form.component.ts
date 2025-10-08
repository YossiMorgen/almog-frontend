import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService } from '../../../../services/classes.service';
import { CoursesService } from '../../../../services/courses.service';
import { UsersService } from '../../../../services/users.service';
import { Class, CreateClass, UpdateClass } from '../../../../models/class';
import { Course } from '../../../../models/course';
import { User } from '../../../../models/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTimepickerModule,
  ],
  providers: [ClassesService, CoursesService, UsersService],
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss']
})
export class ClassFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  classId: number | null = null;
  courses: Course[] = [];
  instructors: User[] = [];

  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'postponed', label: 'Postponed' }
  ];



  constructor(
    private classesService: ClassesService,
    private coursesService: CoursesService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  classForm!: FormGroup;

  ngOnInit(): void {
    this.classForm = this.formBuilder.group({
      course_id: [null as number | null, [Validators.required]],
      class_number: [null as number | null, [Validators.required, Validators.min(1)]],
      class_date: [null as Date | null, [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      location_id: [null as number | null],
      instructor_id: [null as number | null],
      status: ['scheduled', [Validators.required]],
      notes: ['']
    });
    
    this.loadInstructors();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.classId = +params['id'];
        this.loadClass();
      }
    });

    // Listen for start time changes to auto-set end time
    this.classForm.get('start_time')?.valueChanges.subscribe(startTime => {
      if (startTime && !this.classId) {
        this.onStartTimeChange(startTime);
      }
    });
  }

  loadInstructors(): void {
    this.usersService.getInstructors().subscribe({
      next: (response: any) => {
        this.instructors = response.data?.data || [];
      },
      error: (error: any) => {
        console.error('Error loading instructors:', error);
        this.instructors = [];
      }
    });
  }

  loadClass(): void {
    if (!this.classId) return;

    this.loading = true;
    this.classesService.getClass(this.classId).subscribe({
      next: (response: any) => {
        const classData = response.data;
        this.classForm.patchValue({
          course_id: classData.course_id,
          class_number: classData.class_number,
          class_date: new Date(classData.class_date),
          start_time: classData.start_time,
          end_time: classData.end_time,
          location_id: classData.location_id,
          instructor_id: classData.instructor_id,
          status: classData.status,
          notes: classData.notes
        });
        this.classForm.markAsPristine();
        this.classForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load class';
        this.loading = false;
        console.error('Error loading class:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.classForm.markAllAsTouched();
    
    if (!this.classForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.classForm.value;
      
      if (this.classId) {
        const updatePayload: UpdateClass = {
          class_date: formValue.class_date!,
          start_time: formValue.start_time!,
          end_time: formValue.end_time!,
          location_id: formValue.location_id,
          instructor_id: formValue.instructor_id,
          status: formValue.status!,
          notes: formValue.notes
        };
        
        await this.classesService.updateClassAsync(this.classId, updatePayload);
      } else {
        const createPayload: CreateClass = {
          course_id: formValue.course_id!,
          class_number: formValue.class_number!,
          class_date: formValue.class_date!,
          start_time: formValue.start_time!,
          end_time: formValue.end_time!,
          location_id: formValue.location_id,
          instructor_id: formValue.instructor_id,
          status: formValue.status!,
          notes: formValue.notes
        };
        
        await this.classesService.createClassAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/classes']);
    } catch (error: any) {
      console.error('Error saving class:', error);
      this.error = this.classId ? 'Failed to update class' : 'Failed to create class';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.classForm.reset();
    this.classId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/classes']);
  }

  onStartTimeChange(startTime: string): void {
    if (startTime && !this.classId) {
      // Parse the start time and add 45 minutes
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      // Add 45 minutes
      const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);
      
      // Format the end time as HH:MM
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      // Only auto-set end time if it's not already set
      const currentEndTime = this.classForm.get('end_time')?.value;
      if (!currentEndTime) {
        this.classForm.patchValue({ end_time: endTime });
      }
    }
  }

  getInstructorDisplayName(instructorId: number | undefined): string {
    if (!instructorId) return 'No instructor assigned';
    const instructor = this.instructors.find(i => i.id === instructorId);
    return instructor ? (instructor.first_name + ' ' + instructor.last_name || instructor.email) : `Instructor ID: ${instructorId}`;
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.classForm.controls).forEach(key => {
      const control = this.classForm.get(key);
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
