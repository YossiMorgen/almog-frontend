import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [UsersService],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.loadUser();
      }
    });
  }

  loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.usersService.getUser(this.userId).subscribe({
      next: (response: any) => {
        this.user = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load user';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  editUser(): void {
    this.router.navigate(['/crm/users', this.userId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/users']);
  }

  getStatusColor(isActive: boolean | undefined): string {
    return isActive ? 'primary' : 'warn';
  }

  getStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  }

  getDisplayName(user: User): string {
    if (user.display_name) return user.display_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    return user.email;
  }
}

