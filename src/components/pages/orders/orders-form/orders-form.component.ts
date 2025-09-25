import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../../../services/orders.service';
import { StudentsService } from '../../../../services/students.service';
import { Order, CreateOrder, UpdateOrder } from '../../../../models/order';
import { Student } from '../../../../models/student';
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
  selector: 'app-orders-form',
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
  providers: [OrdersService, StudentsService],
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss']
})
export class OrdersFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  orderId: number | null = null;
  students: Student[] = [];

  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  orderForm!: FormGroup;

  constructor(
    private ordersService: OrdersService,
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadOrder();
      }
    });

    this.orderForm = this.formBuilder.group({
      order_number: [''],
      student_id: [null as number | null, [Validators.required]],
      subtotal: [0, [Validators.required, Validators.min(0)]],
      tax_amount: [0, [Validators.required, Validators.min(0)]],
      discount_amount: [0, [Validators.required, Validators.min(0)]],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', [Validators.required]],
      notes: ['']
    });

    this.orderForm.get('subtotal')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.orderForm.get('tax_amount')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.orderForm.get('discount_amount')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (response: any) => {
        this.students = response.data.data;
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
      }
    });
  }

  loadOrder(): void {
    if (!this.orderId) return;

    this.loading = true;
    this.ordersService.getOrder(this.orderId).subscribe({
      next: (response: any) => {
        const orderData = response.data;
        this.orderForm.patchValue({
          order_number: orderData.order_number,
          student_id: orderData.student_id,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount,
          discount_amount: orderData.discount_amount,
          total_amount: orderData.total_amount,
          status: orderData.status,
          notes: orderData.notes
        });
        this.orderForm.markAsPristine();
        this.orderForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load order';
        this.loading = false;
        console.error('Error loading order:', error);
      }
    });
  }

  calculateTotal(): void {
    const subtotal = this.orderForm.get('subtotal')?.value || 0;
    const taxAmount = this.orderForm.get('tax_amount')?.value || 0;
    const discountAmount = this.orderForm.get('discount_amount')?.value || 0;
    
    const total = subtotal + taxAmount - discountAmount;
    this.orderForm.patchValue({ total_amount: total }, { emitEvent: false });
  }

  async submitForm(): Promise<void> {
    this.orderForm.markAllAsTouched();
    
    if (!this.orderForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.orderForm.value;
      
      if (this.orderId) {
        const updatePayload: UpdateOrder = {
          subtotal: formValue.subtotal,
          tax_amount: formValue.tax_amount,
          discount_amount: formValue.discount_amount,
          total_amount: formValue.total_amount,
          status: formValue.status,
          notes: formValue.notes
        };
        
        await this.ordersService.updateOrderAsync(this.orderId, updatePayload);
      } else {
        const createPayload: CreateOrder = {
          order_number: formValue.order_number || undefined,
          student_id: formValue.student_id!,
          subtotal: formValue.subtotal || 0,
          tax_amount: formValue.tax_amount || 0,
          discount_amount: formValue.discount_amount || 0,
          total_amount: formValue.total_amount!,
          status: formValue.status || 'pending',
          notes: formValue.notes
        };
        
        await this.ordersService.createOrderAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/orders']);
    } catch (error: any) {
      console.error('Error saving order:', error);
      this.error = this.orderId ? 'Failed to update order' : 'Failed to create order';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.orderForm.reset();
    this.orderId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/orders']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
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

