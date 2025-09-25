import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseEnrollmentsService } from '../../../../services/course-enrollments.service';
import { CourseEnrollment } from '../../../../models/courseEnrollment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Course } from '../../../../models/course';
import { CoursesService } from '../../../../services/courses.service';
import { Student } from '../../../../models/student';
import { StudentsService } from '../../../../services/students.service';

@Component({
  selector: 'app-course-enrollments-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  providers: [CourseEnrollmentsService],
  templateUrl: './course-enrollments-detail.component.html',
  styleUrls: ['./course-enrollments-detail.component.scss']
})
export class CourseenrollmentsDetailComponent implements OnInit {
  enrollment: CourseEnrollment | null = null;
  course: Course | null = null;
  student: Student | null = null;
  loading = false;
  error: string | null = null;
  enrollmentId: number | null = null;
  currentUser: any = null;

  constructor(
    private courseEnrollmentsService: CourseEnrollmentsService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.enrollmentId = +params['id'];
        this.loadEnrollment();
        this.loadCourse();
        this.loadStudent();
      }
    });
  }

  loadCourse(): void {
    if (!this.enrollment?.course_id) return;
    this.coursesService.getCourse(this.enrollment.course_id).subscribe({
      next: (response: any) => {
        this.course = response.data;
      },
    });
  }

  loadStudent(): void {
    if (!this.enrollment?.student_id) return;
    this.studentsService.getStudent(this.enrollment.student_id).subscribe({
      next: (response: any) => {
        this.student = response.data;
      },
    });
  }

  loadEnrollment(): void {
    if (!this.enrollmentId) return;

    this.loading = true;
    this.error = null;

    this.courseEnrollmentsService.getCourseEnrollment(this.enrollmentId).subscribe({
      next: (response: any) => {
        this.enrollment = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load enrollment';
        this.loading = false;
        console.error('Error loading enrollment:', error);
      }
    });
  }

  editEnrollment(): void {
    if (this.enrollment) {
      this.router.navigate(['/crm/course-enrollments', this.enrollment.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/crm/course-enrollments']);
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'enrolled': return 'Enrolled';
      case 'waitlisted': return 'Waitlisted';
      case 'dropped': return 'Dropped';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'enrolled': return 'text-green-600 bg-green-100';
      case 'waitlisted': return 'text-yellow-600 bg-yellow-100';
      case 'dropped': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }
}

