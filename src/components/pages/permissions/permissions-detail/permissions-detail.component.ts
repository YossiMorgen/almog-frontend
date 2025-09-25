import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService } from '../../../../services/permissions.service';
import { Permission } from '../../../../models/permission';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-permissions-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [PermissionsService],
  templateUrl: './permissions-detail.component.html',
  styleUrls: ['./permissions-detail.component.scss']
})
export class PermissionsDetailComponent implements OnInit {
  permission: Permission | null = null;
  loading = false;
  error: string | null = null;
  permissionId: number | null = null;
  currentUser: any = null;

  constructor(
    private permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.permissionId = +params['id'];
        this.loadPermission();
      }
    });
  }

  loadPermission(): void {
    if (!this.permissionId) return;

    this.loading = true;
    this.permissionsService.getPermission(this.permissionId).subscribe({
      next: (response: any) => {
        this.permission = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load permission';
        this.loading = false;
        console.error('Error loading permission:', error);
      }
    });
  }

  editPermission(): void {
    this.router.navigate(['/crm/permissions', this.permissionId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/permissions']);
  }

  getModuleDisplay(module: string | undefined): string {
    return module || 'Not specified';
  }

  getActionDisplay(action: string | undefined): string {
    return action || 'Not specified';
  }

  getDescriptionDisplay(description: string | undefined): string {
    return description || 'No description provided';
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

