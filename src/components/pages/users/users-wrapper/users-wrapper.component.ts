import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { UsersComponent } from '../users-list/users.component';
import { UserFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-users-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    UsersComponent
  ],
  templateUrl: './users-wrapper.component.html',
  styleUrls: ['./users-wrapper.component.scss']
})
export class UsersWrapperComponent {
  currentFilters: Partial<UserFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<UserFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<UserFilterParams>;
  }
}
