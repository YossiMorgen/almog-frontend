import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../../services/courses.service';
import { Course } from '../../../../models/course';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [CoursesService],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = false;
  error: string | null = null;
  courseId: number | null = null;
  currentUser: any = null;

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.loadCourse();
      }
    });
  }

  loadCourse(): void {
    if (!this.courseId) return;

    this.loading = true;
    this.coursesService.getCourse(this.courseId).subscribe({
      next: (response: any) => {
        this.course = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load course';
        this.loading = false;
        console.error('Error loading course:', error);
      }
    });
  }

  editCourse(): void {
    this.router.navigate(['/crm/courses', this.courseId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/courses']);
  }

  getLevelDisplay(level: string | undefined): string {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'expert': return 'Expert';
      default: return 'Not specified';
    }
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'open': return 'primary';
      case 'full': return 'warn';
      case 'in_progress': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'draft': return 'Draft';
      case 'open': return 'Open';
      case 'full': return 'Full';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
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

  formatTime(time: string | undefined): string {
    return time || 'Not specified';
  }

  formatPrice(price: number | undefined): string {
    return price ? `$${price.toFixed(2)}` : 'Not specified';
  }

  getAgeGroupDisplay(min: number | undefined, max: number | undefined): string {
    if (!min && !max) return 'No age restrictions';
    if (min && max) return `${min} - ${max} years`;
    if (min) return `${min}+ years`;
    if (max) return `Up to ${max} years`;
    return 'Not specified';
  }
}
