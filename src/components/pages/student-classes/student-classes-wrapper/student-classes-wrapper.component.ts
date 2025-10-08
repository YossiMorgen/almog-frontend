import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { StudentclassesComponent } from '../student-classes-list/studentclasses.component';
import { StudentClassFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-student-classes-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    StudentclassesComponent
  ],
  templateUrl: './student-classes-wrapper.component.html',
  styleUrls: ['./student-classes-wrapper.component.scss']
})
export class StudentClassesWrapperComponent {
  currentFilters: Partial<StudentClassFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<StudentClassFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<StudentClassFilterParams>;
  }
}
