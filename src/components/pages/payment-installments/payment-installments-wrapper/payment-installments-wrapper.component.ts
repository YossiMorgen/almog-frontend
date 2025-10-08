import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWrapperComponent } from '../../../shared/table-wrapper/table-wrapper.component';
import { PaymentinstallmentsComponent } from '../payment-installments-list/paymentinstallments.component';
import { PaymentInstallmentFilterParams, TableFilterParams } from '../../../../models/filter-schemas';

@Component({
  selector: 'app-payment-installments-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    TableWrapperComponent,
    PaymentinstallmentsComponent
  ],
  templateUrl: './payment-installments-wrapper.component.html',
  styleUrls: ['./payment-installments-wrapper.component.scss']
})
export class PaymentInstallmentsWrapperComponent {
  currentFilters: Partial<PaymentInstallmentFilterParams> = {};
  
  onFilterChange(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<PaymentInstallmentFilterParams>;
  }

  onDataLoad(filters: Partial<TableFilterParams>): void {
    this.currentFilters = filters as Partial<PaymentInstallmentFilterParams>;
  }
}
