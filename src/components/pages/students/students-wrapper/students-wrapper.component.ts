import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { StudentsComponent } from '../students-list/students.component';
import { StudentFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-students-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    StudentsComponent
  ],
  templateUrl: './students-wrapper.component.html',
  styleUrls: ['./students-wrapper.component.scss']
})
export class StudentsWrapperComponent {
  currentFilters: Partial<StudentFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<StudentFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<StudentFilterParams>;
  }
}
