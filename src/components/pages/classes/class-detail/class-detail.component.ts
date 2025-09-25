import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService } from '../../../../services/classes.service';
import { Class } from '../../../../models/class';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-class-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [ClassesService],
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss']
})
export class ClassDetailComponent implements OnInit {
  classData: Class | null = null;
  loading = false;
  error: string | null = null;
  classId: number | null = null;
  currentUser: any = null;

  constructor(
    private classesService: ClassesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        this.classData = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load class';
        this.loading = false;
        console.error('Error loading class:', error);
      }
    });
  }

  editClass(): void {
    this.router.navigate(['/crm/classes', this.classId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/classes']);
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      case 'postponed': return 'accent';
      default: return 'primary';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'postponed': return 'Postponed';
      default: return 'Unknown';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }

  formatTime(time: string | undefined): string {
    return time || 'Not specified';
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }
}
