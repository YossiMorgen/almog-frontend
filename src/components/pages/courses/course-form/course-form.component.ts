import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../../services/courses.service';
import { SeasonsService } from '../../../../services/seasons.service';
import { UsersService } from '../../../../services/users.service';
import { ClassesLocationsService } from '../../../../services/classes-locations.service';
import { Course, CreateCourse, UpdateCourse } from '../../../../models/course';
import { Season } from '../../../../models/season';
import { User } from '../../../../models/user';
import { ClassesLocation } from '../../../../models/classesLocation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTimepickerModule
  ],
  providers: [CoursesService, SeasonsService, UsersService, ClassesLocationsService],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  courseId: number | null = null;
  seasons: Season[] = [];
  instructors: User[] = [];
  locations: ClassesLocation[] = [];
  preSelectedSeasonId: number | null = null;

  levelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  dayOptions = [
    { value: 'Sunday', label: 'Sunday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' }
  ];

  statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'open', label: 'Open' },
    { value: 'full', label: 'Full' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  courseForm!: FormGroup;


  constructor(
    private coursesService: CoursesService,
    private seasonsService: SeasonsService,
    private usersService: UsersService,
    private classesLocationsService: ClassesLocationsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadSeasons();
    this.loadInstructors();
    this.loadLocations();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.loadCourse();
      }
    });

    this.courseForm = this.formBuilder.group({
      season_id: [null as number | null, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      level: ['beginner', [Validators.required]],
      age_group_min: [null as number | null],
      age_group_max: [null as number | null],
      max_students: [10, [Validators.required, Validators.min(1)]],
      price: [null as number | null, [Validators.required, Validators.min(0)]],
      instructor_id: [null as number | null],
      location_id: [null as number | null, [Validators.required]],
      day_of_week: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      start_date: [null as Date | null, [Validators.required]],
      end_date: [null as Date | null, [Validators.required]],
      status: ['draft', [Validators.required]]
    });

    // Check for season_id in query parameters for auto-filling
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['season_id'] && !this.courseId) {
        const seasonId = parseInt(queryParams['season_id']);
        this.preSelectedSeasonId = seasonId;
        this.courseForm.patchValue({ season_id: seasonId });
        this.onSeasonChange(seasonId);
      }
    });

    // Listen for season selection changes
    this.courseForm.get('season_id')?.valueChanges.subscribe(seasonId => {
      if (seasonId && !this.courseId) {
        this.onSeasonChange(seasonId);
      }
    });

    // Listen for start time changes to auto-set end time
    this.courseForm.get('start_time')?.valueChanges.subscribe(startTime => {
      if (startTime && !this.courseId) {
        this.onStartTimeChange(startTime);
      }
    });
  }

  loadSeasons(): void {
    this.seasonsService.getSeasons().subscribe({
      next: (response: any) => {
        this.seasons = response.data?.data || [];
      },
      error: (error: any) => {
        console.error('Error loading seasons:', error);
        this.seasons = [];
      }
    });
  }

  loadInstructors(): void {
    this.usersService.getInstructors({ limit: 100 }).subscribe({
      next: (response: any) => {
        this.instructors = response.data?.data || [];
      },
      error: (error: any) => {
        console.error('Error loading instructors:', error);
        this.instructors = [];
      }
    });
  }

  loadLocations(): void {
    this.classesLocationsService.getActiveClassesLocations({ limit: 100 }).subscribe({
      next: (response: any) => {
        this.locations = response.data?.data || [];
      },
      error: (error: any) => {
        console.error('Error loading locations:', error);
        this.locations = [];
      }
    });
  }

  loadCourse(): void {
    if (!this.courseId) return;

    this.loading = true;
    this.coursesService.getCourse(this.courseId).subscribe({
      next: (response: any) => {
        const courseData = response.data;
        this.courseForm.patchValue({
          season_id: courseData.season_id,
          name: courseData.name,
          description: courseData.description,
          level: courseData.level,
          age_group_min: courseData.age_group_min,
          age_group_max: courseData.age_group_max,
          max_students: courseData.max_students,
          price: courseData.price,
          instructor_id: courseData.instructor_id,
          location_id: courseData.location_id,
          day_of_week: courseData.day_of_week,
          start_time: courseData.start_time,
          end_time: courseData.end_time,
          start_date: new Date(courseData.start_date),
          end_date: new Date(courseData.end_date),
          status: courseData.status
        });
        this.courseForm.markAsPristine();
        this.courseForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load course';
        this.loading = false;
        console.error('Error loading course:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.courseForm.markAllAsTouched();
    
    if (!this.courseForm.valid) {
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.courseForm.value;
      
      // Format time values to HH:MM format
      const formatTime = (timeValue: any): string => {
        if (!timeValue) return '';
        if (typeof timeValue === 'string') return timeValue;
        if (timeValue instanceof Date) {
          return `${timeValue.getHours().toString().padStart(2, '0')}:${timeValue.getMinutes().toString().padStart(2, '0')}`;
        }
        return '';
      };

      // Format date values to YYYY-MM-DD format
      const formatDate = (dateValue: any): string => {
        if (!dateValue) return '';
        if (typeof dateValue === 'string') return dateValue;
        if (dateValue instanceof Date) {
          return dateValue.toISOString().split('T')[0];
        }
        return '';
      };
      
      if (this.courseId) {
        const updatePayload: UpdateCourse = {
          season_id: formValue.season_id,
          name: formValue.name,
          description: formValue.description,
          level: formValue.level,
          age_group_min: formValue.age_group_min,
          age_group_max: formValue.age_group_max,
          max_students: formValue.max_students,
          price: formValue.price,
          instructor_id: formValue.instructor_id,
          location_id: formValue.location_id,
          day_of_week: formValue.day_of_week,
          start_time: formatTime(formValue.start_time),
          end_time: formatTime(formValue.end_time),
          start_date: formatDate(formValue.start_date) as any,
          end_date: formatDate(formValue.end_date) as any,
          status: formValue.status
        };
        
        await this.coursesService.updateCourseAsync(this.courseId, updatePayload);
      } else {
        const createPayload: CreateCourse = {
          season_id: formValue.season_id!,
          name: formValue.name!,
          description: formValue.description,
          level: formValue.level,
          age_group_min: formValue.age_group_min,
          age_group_max: formValue.age_group_max,
          max_students: formValue.max_students || 10,
          price: formValue.price!,
          instructor_id: formValue.instructor_id,
          location_id: formValue.location_id,
          day_of_week: formValue.day_of_week!,
          start_time: formatTime(formValue.start_time),
          end_time: formatTime(formValue.end_time),
          start_date: formatDate(formValue.start_date) as any,
          end_date: formatDate(formValue.end_date) as any,
          status: formValue.status || 'draft'
        };
        
        await this.coursesService.createCourseAsync(createPayload);
      }
      
      this.resetForm();
      // this.router.navigate(['/crm/courses']);
    } catch (error: any) {
      console.error('Error saving course:', error);
      this.error = this.courseId ? 'Failed to update course' : 'Failed to create course';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.courseForm.reset();
    this.courseId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/courses']);
  }

  getSelectedSeasonName(): string {
    if (!this.preSelectedSeasonId) return '';
    const season = this.seasons.find(s => s.id === this.preSelectedSeasonId);
    return season ? season.name : '';
  }

  getInstructorDisplayName(instructorId: number): string {
    const instructor = this.instructors.find(i => i.id === instructorId);
    if (!instructor) return '';
    
    if (instructor.name) {
      return instructor.name;
    }
    
    return instructor.email;
  }

  getLocationDisplayName(locationId: number): string {
    const location = this.locations.find(l => l.id === locationId);
    if (!location) return '';
    
    return location.name;
  }

  onSeasonChange(seasonId: number): void {
    const selectedSeason = this.seasons.find(season => season.id === seasonId);
    if (selectedSeason && !this.courseId) {
      this.courseForm.patchValue({
        start_date: new Date(selectedSeason.start_date),
        end_date: new Date(selectedSeason.end_date)
      });
    }
  }

  onStartTimeChange(startTime: Date | string): void {
    if (startTime && !this.courseId) {
      
      let startDate: Date;
      
      if (startTime instanceof Date) {
        startDate = new Date(startTime);
      } else {
        const [hours, minutes] = startTime.split(':').map(Number);
        startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
      }
      
      const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);
      
      this.courseForm.patchValue({ end_time: endDate });
    }
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.courseForm.controls).forEach(key => {
      const control = this.courseForm.get(key);
      if (control && control.invalid) {
        const controlErrors = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(errorKey => {
            errors.push(`Control '${key}' has error: ${errorKey}`);
          });
        }
      }
    });
    return errors.join('\n');
  }
}
