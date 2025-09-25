import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentInstallmentsService } from '../../../../services/payment-installments.service';
import { PaymentInstallment, CreatePaymentInstallment, UpdatePaymentInstallment } from '../../../../models/paymentInstallment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payment-installments-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [PaymentInstallmentsService],
  templateUrl: './payment-installments-form.component.html',
  styleUrls: ['./payment-installments-form.component.scss']
})
export class PaymentinstallmentsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  installmentId: number | null = null;

  paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'other', label: 'Other' }
  ];

  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  installmentForm!: FormGroup;

  constructor(
    private paymentInstallmentsService: PaymentInstallmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.installmentId = +params['id'];
        this.loadPaymentInstallment();
      }
    });

    this.installmentForm = this.formBuilder.group({
      payment_id: [null as number | null, [Validators.required]],
      installment_number: [null as number | null, [Validators.required, Validators.min(1)]],
      amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
      payment_method: ['', [Validators.required]],
      payment_date: [null as Date | null, [Validators.required]],
      transaction_reference: [''],
      status: ['pending', [Validators.required]],
      notes: ['']
    });
  }

  loadPaymentInstallment(): void {
    if (!this.installmentId) return;

    this.loading = true;
    this.paymentInstallmentsService.getPaymentInstallment(this.installmentId).subscribe({
      next: (response: any) => {
        const installmentData = response.data;
        this.installmentForm.patchValue({
          payment_id: installmentData.payment_id,
          installment_number: installmentData.installment_number,
          amount: installmentData.amount,
          payment_method: installmentData.payment_method,
          payment_date: new Date(installmentData.payment_date),
          transaction_reference: installmentData.transaction_reference,
          status: installmentData.status,
          notes: installmentData.notes
        });
        this.installmentForm.markAsPristine();
        this.installmentForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load payment installment';
        this.loading = false;
        console.error('Error loading payment installment:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.installmentForm.markAllAsTouched();
    
    if (!this.installmentForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.installmentForm.value;
      
      if (this.installmentId) {
        const updatePayload: UpdatePaymentInstallment = {
          amount: formValue.amount,
          payment_method: formValue.payment_method,
          payment_date: formValue.payment_date,
          transaction_reference: formValue.transaction_reference,
          status: formValue.status,
          notes: formValue.notes
        };
        
        await this.paymentInstallmentsService.updatePaymentInstallmentAsync(this.installmentId, updatePayload);
      } else {
        const createPayload: CreatePaymentInstallment = {
          payment_id: formValue.payment_id!,
          installment_number: formValue.installment_number!,
          amount: formValue.amount!,
          payment_method: formValue.payment_method!,
          payment_date: formValue.payment_date!,
          transaction_reference: formValue.transaction_reference,
          status: formValue.status || 'pending',
          notes: formValue.notes
        };
        
        await this.paymentInstallmentsService.createPaymentInstallmentAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/payment-installments']);
    } catch (error: any) {
      console.error('Error saving payment installment:', error);
      this.error = this.installmentId ? 'Failed to update payment installment' : 'Failed to create payment installment';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.installmentForm.reset();
    this.installmentId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/payment-installments']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.installmentForm.controls).forEach(key => {
      const control = this.installmentForm.get(key);
      if (control && control.invalid) {
        const controlErrors = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(errorKey => {
            errors.push(`Control '${key}' has error: ${errorKey}`);
          });
        }
      }
    });
    return errors.join('\n');
  }
}