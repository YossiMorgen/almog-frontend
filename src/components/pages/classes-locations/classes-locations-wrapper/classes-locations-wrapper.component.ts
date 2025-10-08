import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { ClassesLocationsListComponent } from '../classes-locations-list/classes-locations-list.component';
import { ClassesLocationFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-classes-locations-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    ClassesLocationsListComponent
  ],
  templateUrl: './classes-locations-wrapper.component.html',
  styleUrls: ['./classes-locations-wrapper.component.scss']
})
export class ClassesLocationsWrapperComponent {
  currentFilters: Partial<ClassesLocationFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<ClassesLocationFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<ClassesLocationFilterParams>;
  }
}
