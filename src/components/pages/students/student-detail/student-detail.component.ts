import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../../../services/students.service';
import { Student } from '../../../../models/student';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [StudentsService],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  loading = false;
  error: string | null = null;
  studentId: number | null = null;
  currentUser: any = null;

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentId = +params['id'];
        this.loadStudent();
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
}
