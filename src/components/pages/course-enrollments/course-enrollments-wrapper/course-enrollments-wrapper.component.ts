import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { CourseenrollmentsComponent } from '../course-enrollments-list/courseenrollments.component';
import { CourseEnrollmentFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-course-enrollments-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    CourseenrollmentsComponent
  ],
  templateUrl: './course-enrollments-wrapper.component.html',
  styleUrls: ['./course-enrollments-wrapper.component.scss']
})
export class CourseEnrollmentsWrapperComponent {
  currentFilters: Partial<CourseEnrollmentFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<CourseEnrollmentFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<CourseEnrollmentFilterParams>;
  }
}
