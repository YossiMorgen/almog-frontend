import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SeasonsService } from '../../../../services/seasons.service';
import { Season } from '../../../../models/season';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-seasons-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [SeasonsService],
  templateUrl: './seasons-detail.component.html',
  styleUrls: ['./seasons-detail.component.scss']
})
export class SeasonsDetailComponent implements OnInit {
  season: Season | null = null;
  loading = false;
  error: string | null = null;
  seasonId: number | null = null;
  currentUser: any = null;

  constructor(
    private seasonsService: SeasonsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.seasonId = +params['id'];
        this.loadSeason();
      }
    });
  }

  loadSeason(): void {
    if (!this.seasonId) return;

    this.loading = true;
    this.seasonsService.getSeason(this.seasonId).subscribe({
      next: (response: any) => {
        this.season = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load season';
        this.loading = false;
        console.error('Error loading season:', error);
      }
    });
  }

  editSeason(): void {
    this.router.navigate(['/crm/seasons', this.seasonId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/crm/seasons']);
  }

  getActiveStatusColor(isActive: boolean | undefined): string {
    return isActive ? 'accent' : 'primary';
  }

  getActiveStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active Season' : 'Inactive Season';
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  }
}
