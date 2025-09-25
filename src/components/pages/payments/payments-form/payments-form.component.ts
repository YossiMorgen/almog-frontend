import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../../../services/payments.service';
import { Payment, CreatePayment, UpdatePayment } from '../../../../models/payment';
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
  selector: 'app-payments-form',
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
  providers: [PaymentsService],
  templateUrl: './payments-form.component.html',
  styleUrls: ['./payments-form.component.scss']
})
export class PaymentsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  paymentId: number | null = null;

  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  paymentForm!: FormGroup;

  constructor(
    private paymentsService: PaymentsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.paymentId = +params['id'];
        this.loadPayment();
      }
    });

    this.paymentForm = this.formBuilder.group({
      payment_number: ['', [Validators.required, Validators.minLength(1)]],
      order_id: [null as number | null, [Validators.required, Validators.min(1)]],
      total_amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
      paid_amount: [0, [Validators.min(0)]],
      payment_status: ['pending', [Validators.required]],
      due_date: [null as Date | null],
      notes: ['']
    });
  }

  loadPayment(): void {
    if (!this.paymentId) return;

    this.loading = true;
    this.paymentsService.getPayment(this.paymentId).subscribe({
      next: (response: any) => {
        const paymentData = response.data;
        this.paymentForm.patchValue({
          payment_number: paymentData.payment_number,
          order_id: paymentData.order_id,
          total_amount: paymentData.total_amount,
          paid_amount: paymentData.paid_amount,
          payment_status: paymentData.payment_status,
          due_date: paymentData.due_date ? new Date(paymentData.due_date) : null,
          notes: paymentData.notes
        });
        this.paymentForm.markAsPristine();
        this.paymentForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load payment';
        this.loading = false;
        console.error('Error loading payment:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.paymentForm.markAllAsTouched();
    
    if (!this.paymentForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.paymentForm.value;
      
      if (this.paymentId) {
        const updatePayload: UpdatePayment = {
          paid_amount: formValue.paid_amount,
          payment_status: formValue.payment_status,
          due_date: formValue.due_date,
          notes: formValue.notes
        };
        
        await this.paymentsService.updatePaymentAsync(this.paymentId, updatePayload);
      } else {
        const createPayload: CreatePayment = {
          payment_number: formValue.payment_number!,
          order_id: formValue.order_id!,
          total_amount: formValue.total_amount!,
          payment_status: formValue.payment_status || 'pending',
          due_date: formValue.due_date,
          notes: formValue.notes
        };
        
        await this.paymentsService.createPaymentAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/payments']);
    } catch (error: any) {
      console.error('Error saving payment:', error);
      this.error = this.paymentId ? 'Failed to update payment' : 'Failed to create payment';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.paymentForm.reset();
    this.paymentId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/payments']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
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


