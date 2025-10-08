import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { SeasonsComponent } from '../seasons-list/seasons.component';
import { SeasonFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-seasons-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    SeasonsComponent
  ],
  templateUrl: './seasons-wrapper.component.html',
  styleUrls: ['./seasons-wrapper.component.scss']
})
export class SeasonsWrapperComponent {
  currentFilters: Partial<SeasonFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<SeasonFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<SeasonFilterParams>;
  }
}
