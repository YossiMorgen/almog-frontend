import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { CoursesComponent } from '../courses-list/courses.component';
import { TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-courses-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    CoursesComponent
  ],
  templateUrl: './courses-wrapper.component.html',
  styleUrls: ['./courses-wrapper.component.scss']
})
export class CoursesWrapperComponent {
  currentFilters: Partial<TableFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters;
  }
}
