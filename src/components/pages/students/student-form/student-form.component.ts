import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../../../services/students.service';
import { Student, CreateStudent, UpdateStudent } from '../../../../models/student';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-student-form',
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
    MatCheckboxModule
  ],
  providers: [StudentsService],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  studentId: number | null = null;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'he', label: 'Hebrew' }
  ];

  studentForm!: FormGroup;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentId = +params['id'];
        this.loadStudent();
      }
    });

    this.studentForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      student_code: [''],
      date_of_birth: [null as Date | null],
      gender: [''],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      postal_code: [''],
      parent_name: [''],
      parent_email: ['', [Validators.email]],
      parent_phone: [''],
      emergency_contact_name: [''],
      emergency_contact_phone: [''],
      medical_notes: [''],
      notes: [''],
      language: ['he'],
      is_active: [true]
    });
  }

  loadStudent(): void {
    if (!this.studentId) return;

    this.loading = true;
    this.studentsService.getStudent(this.studentId).subscribe({
      next: (response: any) => {
        const studentData = response.data;
        this.studentForm.patchValue({
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          student_code: studentData.student_code,
          date_of_birth: studentData.date_of_birth ? new Date(studentData.date_of_birth) : null,
          gender: studentData.gender,
          email: studentData.email,
          phone: studentData.phone,
          address: studentData.address,
          city: studentData.city,
          postal_code: studentData.postal_code,
          parent_name: studentData.parent_name,
          parent_email: studentData.parent_email,
          parent_phone: studentData.parent_phone,
          emergency_contact_name: studentData.emergency_contact_name,
          emergency_contact_phone: studentData.emergency_contact_phone,
          medical_notes: studentData.medical_notes,
          notes: studentData.notes,
          language: studentData.language || 'he',
          is_active: studentData.is_active
        });
        this.studentForm.markAsPristine();
        this.studentForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load student';
        this.loading = false;
        console.error('Error loading student:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.studentForm.markAllAsTouched();
    
    if (!this.studentForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.studentForm.value;
      
      if (this.studentId) {
        const updatePayload: UpdateStudent = {
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          student_code: formValue.student_code,
          date_of_birth: formValue.date_of_birth,
          gender: formValue.gender,
          email: formValue.email,
          phone: formValue.phone,
          address: formValue.address,
          city: formValue.city,
          postal_code: formValue.postal_code,
          parent_name: formValue.parent_name,
          parent_email: formValue.parent_email,
          parent_phone: formValue.parent_phone,
          emergency_contact_name: formValue.emergency_contact_name,
          emergency_contact_phone: formValue.emergency_contact_phone,
          medical_notes: formValue.medical_notes,
          notes: formValue.notes,
          language: formValue.language,
          is_active: formValue.is_active
        };
        
        await this.studentsService.updateStudentAsync(this.studentId, updatePayload);
      } else {
        const createPayload: CreateStudent = {
          first_name: formValue.first_name!,
          last_name: formValue.last_name!,
          student_code: formValue.student_code,
          date_of_birth: formValue.date_of_birth,
          gender: formValue.gender,
          email: formValue.email,
          phone: formValue.phone,
          address: formValue.address,
          city: formValue.city,
          postal_code: formValue.postal_code,
          parent_name: formValue.parent_name,
          parent_email: formValue.parent_email,
          parent_phone: formValue.parent_phone,
          emergency_contact_name: formValue.emergency_contact_name,
          emergency_contact_phone: formValue.emergency_contact_phone,
          medical_notes: formValue.medical_notes,
          notes: formValue.notes,
          language: formValue.language || 'he',
          is_active: formValue.is_active ?? true
        };
        
        await this.studentsService.createStudentAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/students']);
    } catch (error: any) {
      console.error('Error saving student:', error);
      this.error = this.studentId ? 'Failed to update student' : 'Failed to create student';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.studentForm.reset();
    this.studentId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/students']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.get(key);
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
