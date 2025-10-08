import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { RolesComponent } from '../roles-list/roles.component';
import { RoleFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-roles-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    RolesComponent
  ],
  templateUrl: './roles-wrapper.component.html',
  styleUrls: ['./roles-wrapper.component.scss']
})
export class RolesWrapperComponent {
  currentFilters: Partial<RoleFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<RoleFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<RoleFilterParams>;
  }
}
