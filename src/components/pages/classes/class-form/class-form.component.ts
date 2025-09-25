import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService } from '../../../../services/classes.service';
import { CoursesService } from '../../../../services/courses.service';
import { Class, CreateClass, UpdateClass } from '../../../../models/class';
import { Course } from '../../../../models/course';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
  providers: [ClassesService, CoursesService],
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss']
})
export class ClassFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  classId: number | null = null;
  courses: Course[] = [];

  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'postponed', label: 'Postponed' }
  ];



  constructor(
    private classesService: ClassesService,
    private coursesService: CoursesService,
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
      location: [''],
      instructor_id: [null as number | null],
      status: ['scheduled', [Validators.required]],
      notes: ['']
    });
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.classId = +params['id'];
        this.loadClass();
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
          location: classData.location,
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
          location: formValue.location,
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
          location: formValue.location,
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
