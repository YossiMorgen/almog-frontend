import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { PaymentsComponent } from '../payments-list/payments.component';
import { PaymentFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-payments-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    PaymentsComponent
  ],
  templateUrl: './payments-wrapper.component.html',
  styleUrls: ['./payments-wrapper.component.scss']
})
export class PaymentsWrapperComponent {
  currentFilters: Partial<PaymentFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<PaymentFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<PaymentFilterParams>;
  }
}
