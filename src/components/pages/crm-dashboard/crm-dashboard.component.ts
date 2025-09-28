import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-crm-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.scss']
})
export class CrmDashboardComponent implements OnInit {
  stats = {
    totalStudents: 0,
    totalCourses: 0,
    totalClasses: 0,
    activeStudents: 0
  };
  loading = false;
  error: string | null = null;
  currentUser: any = null;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TODO: Get current user when auth is ready
    // this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardStatsAsync().then(stats => {
      this.stats = stats;
      this.loading = false;
    }).catch(error => {
      this.error = 'Failed to load dashboard statistics';
      this.loading = false;
      console.error('Error loading dashboard stats:', error);
    });
  }

  navigateToStudents(): void {
    this.router.navigate(['/crm/students']);
  }

  navigateToCourses(): void {
    this.router.navigate(['/crm/courses']);
  }

  navigateToClasses(): void {
    this.router.navigate(['/crm/classes']);
  }

  navigateToNewStudent(): void {
    this.router.navigate(['/crm/students/new']);
  }

  navigateToNewCourse(): void {
    this.router.navigate(['/crm/courses/new']);
  }

  navigateToNewClass(): void {
    this.router.navigate(['/crm/classes/new']);
  }

  navigateToSeasons(): void {
    this.router.navigate(['/crm/seasons']);
  }

  refreshStats(): void {
    this.loadDashboardStats();
  }
}
