import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentClassesService } from '../../../../services/student-classes.service';
import { StudentClass } from '../../../../models/studentClass';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-student-classes-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [StudentClassesService],
  templateUrl: './student-classes-detail.component.html',
  styleUrls: ['./student-classes-detail.component.scss']
})
export class StudentclassesDetailComponent implements OnInit {
  studentClass: StudentClass | null = null;
  loading = false;
  error: string | null = null;
  studentClassId: number | null = null;
  currentUser: any = null;

  constructor(
    private studentClassesService: StudentClassesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentClassId = +params['id'];
        this.loadStudentClass();
      }
    });
  }

  loadStudentClass(): void {
    if (!this.studentClassId) return;

    this.loading = true;
    this.studentClassesService.getStudentClass(this.studentClassId).subscribe({
      next: (response: any) => {
        this.studentClass = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load student class';
        this.loading = false;
        console.error('Error loading student class:', error);
      }
    });
  }

  editStudentClass(): void {
    this.router.navigate(['/crm/student-classes', this.studentClassId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/student-classes']);
  }

  getAttendanceStatusDisplay(status: string | undefined): string {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      default: return 'Not specified';
    }
  }

  getAttendanceStatusColor(status: string | undefined): string {
    switch (status) {
      case 'present': return 'primary';
      case 'absent': return 'warn';
      case 'late': return 'accent';
      case 'excused': return 'primary';
      default: return 'primary';
    }
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