import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { PermissionsComponent } from '../permissions-list/permissions.component';
import { PermissionFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-permissions-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    PermissionsComponent
  ],
  templateUrl: './permissions-wrapper.component.html',
  styleUrls: ['./permissions-wrapper.component.scss']
})
export class PermissionsWrapperComponent {
  currentFilters: Partial<PermissionFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<PermissionFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<PermissionFilterParams>;
  }
}
