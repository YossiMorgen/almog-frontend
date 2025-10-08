import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { OrderItemsComponent } from '../order-items-list/orderitems.component';
import { OrderItemFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-order-items-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    OrderItemsComponent
  ],
  templateUrl: './order-items-wrapper.component.html',
  styleUrls: ['./order-items-wrapper.component.scss']
})
export class OrderItemsWrapperComponent {
  currentFilters: Partial<OrderItemFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<OrderItemFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<OrderItemFilterParams>;
  }
}
