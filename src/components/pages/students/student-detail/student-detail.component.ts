import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../../../services/students.service';
import { StudentHealthInsuranceService } from '../../../../services/health-insurance.service';
import { Student } from '../../../../models/student';
import { StudentHealthInsurance } from '../../../../models/studentHealthInsurance';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [StudentsService, StudentHealthInsuranceService],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  healthInsurances: StudentHealthInsurance[] = [];
  loading = false;
  healthInsuranceLoading = false;
  error: string | null = null;
  studentId: number | null = null;
  currentUser: any = null;

  displayedColumns: string[] = ['health_insurance_name', 'policy_number', 'group_number', 'effective_date', 'expiration_date', 'status'];

  constructor(
    private studentsService: StudentsService,
    private studentHealthInsuranceService: StudentHealthInsuranceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentId = +params['id'];
        this.loadStudent();
        this.loadHealthInsurances();
      }
    });
  }

  loadStudent(): void {
    if (!this.studentId) return;

    this.loading = true;
    this.studentsService.getStudent(this.studentId).subscribe({
      next: (response: any) => {
        this.student = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load student';
        this.loading = false;
        console.error('Error loading student:', error);
      }
    });
  }

  loadHealthInsurances(): void {
    if (!this.studentId) return;

    this.healthInsuranceLoading = true;
    this.studentHealthInsuranceService.getByStudentId(this.studentId).subscribe({
      next: (response: any) => {
        this.healthInsurances = response.data || [];
        this.healthInsuranceLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading health insurances:', error);
        this.healthInsuranceLoading = false;
      }
    });
  }

  editStudent(): void {
    this.router.navigate(['/crm/students', this.studentId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/students']);
  }

  getGenderDisplay(gender: string | undefined): string {
    switch (gender) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'other': return 'Other';
      default: return 'Not specified';
    }
  }

  getStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  }

  getStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }

  getHealthInsuranceStatus(insurance: StudentHealthInsurance): string {
    if (!insurance.is_active) return 'Inactive';
    
    const now = new Date();
    const effectiveDate = insurance.effective_date ? new Date(insurance.effective_date) : null;
    const expirationDate = insurance.expiration_date ? new Date(insurance.expiration_date) : null;
    
    if (effectiveDate && now < effectiveDate) return 'Future';
    if (expirationDate && now > expirationDate) return 'Expired';
    return 'Active';
  }

  getHealthInsuranceStatusClass(insurance: StudentHealthInsurance): string {
    const status = this.getHealthInsuranceStatus(insurance);
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      case 'Future': return 'text-blue-600 bg-blue-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  addHealthInsurance(): void {
    // TODO: Implement add health insurance functionality
    console.log('Add health insurance for student:', this.studentId);
  }

  editHealthInsurance(insurance: StudentHealthInsurance): void {
    // TODO: Implement edit health insurance functionality
    console.log('Edit health insurance:', insurance);
  }
}
