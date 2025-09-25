import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentClassesService } from '../../../../services/student-classes.service';
import { StudentClass, CreateStudentClass, UpdateStudentClass } from '../../../../models/studentClass';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-student-classes-form',
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
    MatProgressSpinnerModule
  ],
  providers: [StudentClassesService],
  templateUrl: './student-classes-form.component.html',
  styleUrls: ['./student-classes-form.component.scss']
})
export class StudentclassesFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  studentClassId: number | null = null;

  attendanceStatusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  studentClassForm!: FormGroup;

  constructor(
    private studentClassesService: StudentClassesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentClassId = +params['id'];
        this.loadStudentClass();
      }
    });

    this.studentClassForm = this.formBuilder.group({
      class_id: ['', [Validators.required, Validators.min(1)]],
      student_id: ['', [Validators.required, Validators.min(1)]],
      attendance_status: ['present', [Validators.required]],
      notes: [''],
      marked_at: [new Date()],
      marked_by: ['']
    });
  }

  loadStudentClass(): void {
    if (!this.studentClassId) return;

    this.loading = true;
    this.studentClassesService.getStudentClass(this.studentClassId).subscribe({
      next: (response: any) => {
        const studentClassData = response.data;
        this.studentClassForm.patchValue({
          class_id: studentClassData.class_id,
          student_id: studentClassData.student_id,
          attendance_status: studentClassData.attendance_status,
          notes: studentClassData.notes,
          marked_at: studentClassData.marked_at ? new Date(studentClassData.marked_at) : new Date(),
          marked_by: studentClassData.marked_by
        });
        this.studentClassForm.markAsPristine();
        this.studentClassForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load student class';
        this.loading = false;
        console.error('Error loading student class:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.studentClassForm.markAllAsTouched();
    
    if (!this.studentClassForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.studentClassForm.value;
      
      if (this.studentClassId) {
        const updatePayload: UpdateStudentClass = {
          attendance_status: formValue.attendance_status,
          notes: formValue.notes,
          marked_at: formValue.marked_at,
          marked_by: formValue.marked_by
        };
        
        await this.studentClassesService.updateStudentClassAsync(this.studentClassId, updatePayload);
      } else {
        const createPayload: CreateStudentClass = {
          class_id: formValue.class_id,
          student_id: formValue.student_id,
          attendance_status: formValue.attendance_status,
          notes: formValue.notes,
          marked_at: formValue.marked_at,
          marked_by: formValue.marked_by
        };
        
        await this.studentClassesService.createStudentClassAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/student-classes']);
    } catch (error: any) {
      console.error('Error saving student class:', error);
      this.error = this.studentClassId ? 'Failed to update student class' : 'Failed to create student class';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.studentClassForm.reset();
    this.studentClassId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/student-classes']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.studentClassForm.controls).forEach(key => {
      const control = this.studentClassForm.get(key);
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