import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassesLocation } from '../../../../models/classesLocation';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';

@Component({
  selector: 'app-classes-locations-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './classes-locations-detail.component.html',
  styleUrls: ['./classes-locations-detail.component.scss']
})
export class ClassesLocationsDetailComponent implements OnInit {
  location: ClassesLocation | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private classesLocationsService: ClassesLocationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadLocation(id);
      }
    });
  }

  loadLocation(id: number): void {
    this.loading = true;
    this.error = null;

    this.classesLocationsService.getClassesLocation(id).subscribe({
      next: (response: any) => {
        this.location = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load location details';
        this.loading = false;
        console.error('Error loading location:', error);
      }
    });
  }

  editLocation(): void {
    if (this.location) {
      this.router.navigate(['/crm/classes-locations', this.location.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/crm/classes-locations']);
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }
}
