import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles.service';
import { Role } from '../../../../models/role';
import { User } from '../../../../models/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersService } from '../../../../services';
import { PermissionsComponent } from '../../permissions/permissions-list/permissions.component';
@Component({
  selector: 'app-roles-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    PermissionsComponent
  ],
  providers: [RolesService, UsersService],
  templateUrl: './roles-detail.component.html',
  styleUrls: ['./roles-detail.component.scss']
})
export class RolesDetailComponent implements OnInit {
  role: Role | null = null;
  loading = false;
  error: string | null = null;
  roleId: number | null = null;
  currentUser: any = null;
  
  users: User[] = [];
  usersLoading = false;
  usersError: string | null = null;
  
  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
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
        this.loadUsersByRole();
      },
      error: (error: any) => {
        this.error = 'Failed to load role';
        this.loading = false;
        console.error('Error loading role:', error);
      }
    });
  }

  loadUsersByRole(): void {
    if (!this.roleId || !this.role) return;

    this.usersLoading = true;
    this.usersError = null;
    
    this.userService.getUsersByRole(this.role.name, { limit: 50 }).subscribe({
      next: (response: any) => {
        this.users = response.data?.data || [];
        this.usersLoading = false;
      },
      error: (error: any) => {
        this.usersError = 'Failed to load users with this role';
        this.usersLoading = false;
        console.error('Error loading users by role:', error);
      }
    });
  }

  editRole(): void {
    this.router.navigate(['/crm/roles', this.roleId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/roles']);
  }

  viewUser(user: User): void {
    this.router.navigate(['/crm/users', user.id]);
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

  getUserDisplayName(user: User): string {
    if (user.display_name) return user.display_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    return user.email || 'Unknown User';
  }

  getUserStatus(user: User): string {
    return user.is_active ? 'Active' : 'Inactive';
  }

  getUserStatusColor(user: User): string {
    return user.is_active ? 'primary' : 'warn';
  }
}


