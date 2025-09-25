import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles.service';
import { Role } from '../../../../models/role';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-roles-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [RolesService],
  templateUrl: './roles-detail.component.html',
  styleUrls: ['./roles-detail.component.scss']
})
export class RolesDetailComponent implements OnInit {
  role: Role | null = null;
  loading = false;
  error: string | null = null;
  roleId: number | null = null;
  currentUser: any = null;

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.roleId = +params['id'];
        this.loadRole();
      }
    });
  }

  loadRole(): void {
    if (!this.roleId) return;

    this.loading = true;
    this.rolesService.getRole(this.roleId).subscribe({
      next: (response: any) => {
        this.role = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load role';
        this.loading = false;
        console.error('Error loading role:', error);
      }
    });
  }

  editRole(): void {
    this.router.navigate(['/crm/roles', this.roleId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/roles']);
  }

  getSystemRoleColor(isSystem: boolean | undefined): string {
    return isSystem ? 'accent' : 'primary';
  }

  getSystemRoleText(isSystem: boolean | undefined): string {
    return isSystem ? 'System Role' : 'Custom Role';
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }
}


