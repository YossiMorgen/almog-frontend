import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseEnrollmentsService } from '../../../../services/course-enrollments.service';
import { CoursesService } from '../../../../services/courses.service';
import { StudentsService } from '../../../../services/students.service';
import { CourseEnrollment, CreateCourseEnrollment, UpdateCourseEnrollment } from '../../../../models/courseEnrollment';
import { Course } from '../../../../models/course';
import { Student } from '../../../../models/student';
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
  selector: 'app-course-enrollments-form',
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
    MatProgressSpinnerModule
  ],
  providers: [CourseEnrollmentsService, CoursesService, StudentsService],
  templateUrl: './course-enrollments-form.component.html',
  styleUrls: ['./course-enrollments-form.component.scss']
})
export class CourseenrollmentsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  enrollmentId: number | null = null;
  courses: Course[] = [];
  students: Student[] = [];

  statusOptions = [
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'waitlisted', label: 'Waitlisted' },
    { value: 'dropped', label: 'Dropped' },
    { value: 'completed', label: 'Completed' }
  ];

  enrollmentForm!: FormGroup;

  constructor(
    private courseEnrollmentsService: CourseEnrollmentsService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadStudents();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.enrollmentId = +params['id'];
        this.loadEnrollment();
      }
    });

    this.enrollmentForm = this.formBuilder.group({
      course_id: [null as number | null, [Validators.required]],
      student_id: [null as number | null, [Validators.required]],
      enrollment_date: [new Date(), [Validators.required]],
      status: ['enrolled', [Validators.required]],
      notes: ['']
    });
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (response: any) => {
        this.courses = response.data.data || response.data;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (response: any) => {
        this.students = response.data.data || response.data;
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
      }
    });
  }

  loadEnrollment(): void {
    if (!this.enrollmentId) return;

    this.loading = true;
    this.courseEnrollmentsService.getCourseEnrollment(this.enrollmentId).subscribe({
      next: (response: any) => {
        const enrollmentData = response.data;
        this.enrollmentForm.patchValue({
          course_id: enrollmentData.course_id,
          student_id: enrollmentData.student_id,
          enrollment_date: new Date(enrollmentData.enrollment_date),
          status: enrollmentData.status,
          notes: enrollmentData.notes
        });
        this.enrollmentForm.markAsPristine();
        this.enrollmentForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load enrollment';
        this.loading = false;
        console.error('Error loading enrollment:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.enrollmentForm.markAllAsTouched();
    
    if (!this.enrollmentForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.enrollmentForm.value;
      
      if (this.enrollmentId) {
        const updatePayload: UpdateCourseEnrollment = {
          status: formValue.status,
          notes: formValue.notes
        };
        
        await this.courseEnrollmentsService.updateCourseEnrollmentAsync(this.enrollmentId, updatePayload);
      } else {
        const createPayload: CreateCourseEnrollment = {
          course_id: formValue.course_id!,
          student_id: formValue.student_id!,
          status: formValue.status || 'enrolled',
          notes: formValue.notes
        };
        
        await this.courseEnrollmentsService.createCourseEnrollmentAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/course-enrollments']);
    } catch (error: any) {
      console.error('Error saving enrollment:', error);
      this.error = this.enrollmentId ? 'Failed to update enrollment' : 'Failed to create enrollment';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.enrollmentForm.reset();
    this.enrollmentId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/course-enrollments']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.enrollmentForm.controls).forEach(key => {
      const control = this.enrollmentForm.get(key);
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