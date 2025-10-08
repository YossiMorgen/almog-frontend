import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { OrdersListComponent } from '../orders-list/orders-list.component';
import { OrderFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-orders-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    OrdersListComponent
  ],
  templateUrl: './orders-wrapper.component.html',
  styleUrls: ['./orders-wrapper.component.scss']
})
export class OrdersWrapperComponent {
  currentFilters: Partial<OrderFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<OrderFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<OrderFilterParams>;
  }
}
