import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { ProductsComponent } from '../products-list/products.component';
import { ProductFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-products-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    ProductsComponent
  ],
  templateUrl: './products-wrapper.component.html',
  styleUrls: ['./products-wrapper.component.scss']
})
export class ProductsWrapperComponent {
  currentFilters: Partial<ProductFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<ProductFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<ProductFilterParams>;
  }
}
