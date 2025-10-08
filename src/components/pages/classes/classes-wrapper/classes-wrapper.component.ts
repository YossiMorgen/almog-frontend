import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { ClassesComponent } from '../classes-list/classes.component';
import { ClassFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-classes-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    ClassesComponent
  ],
  templateUrl: './classes-wrapper.component.html',
  styleUrls: ['./classes-wrapper.component.scss']
})
export class ClassesWrapperComponent {
  currentFilters: Partial<ClassFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<ClassFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<ClassFilterParams>;
  }
}
