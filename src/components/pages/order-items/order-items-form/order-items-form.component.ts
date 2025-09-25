import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemsService } from '../../../../services/order-items.service';
import { OrderItem, CreateOrderItem, UpdateOrderItem } from '../../../../models/orderItem';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-items-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [OrderItemsService],
  templateUrl: './order-items-form.component.html',
  styleUrls: ['./order-items-form.component.scss']
})
export class OrderItemsFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  orderItemId: number | null = null;

  itemTypeOptions = [
    { value: 'course', label: 'Course' },
    { value: 'product', label: 'Product' }
  ];

  orderItemForm!: FormGroup;

  constructor(
    private orderItemsService: OrderItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderItemId = +params['id'];
        this.loadOrderItem();
      }
    });

    this.orderItemForm = this.formBuilder.group({
      order_id: [null as number | null, [Validators.required, Validators.min(1)]],
      item_type: ['course', [Validators.required]],
      item_id: [null as number | null, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit_price: [null as number | null, [Validators.required, Validators.min(0)]],
      discount_amount: [0, [Validators.min(0)]],
      tax_amount: [0, [Validators.min(0)]],
      total_price: [null as number | null, [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    this.orderItemForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderItemForm.get('unit_price')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderItemForm.get('discount_amount')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderItemForm.get('tax_amount')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  loadOrderItem(): void {
    if (!this.orderItemId) return;

    this.loading = true;
    this.orderItemsService.getOrderItem(this.orderItemId).subscribe({
      next: (response: any) => {
        const orderItemData = response.data;
        this.orderItemForm.patchValue({
          order_id: orderItemData.order_id,
          item_type: orderItemData.item_type,
          item_id: orderItemData.item_id,
          quantity: orderItemData.quantity,
          unit_price: orderItemData.unit_price,
          discount_amount: orderItemData.discount_amount,
          tax_amount: orderItemData.tax_amount,
          total_price: orderItemData.total_price,
          notes: orderItemData.notes
        });
        this.orderItemForm.markAsPristine();
        this.orderItemForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load order item';
        this.loading = false;
        console.error('Error loading order item:', error);
      }
    });
  }

  calculateTotal(): void {
    const quantity = this.orderItemForm.get('quantity')?.value || 0;
    const unitPrice = this.orderItemForm.get('unit_price')?.value || 0;
    const discountAmount = this.orderItemForm.get('discount_amount')?.value || 0;
    const taxAmount = this.orderItemForm.get('tax_amount')?.value || 0;
    
    const subtotal = quantity * unitPrice;
    const total = subtotal - discountAmount + taxAmount;
    
    this.orderItemForm.patchValue({
      total_price: Math.max(0, total)
    }, { emitEvent: false });
  }

  async submitForm(): Promise<void> {
    this.orderItemForm.markAllAsTouched();
    
    if (!this.orderItemForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.orderItemForm.value;
      
      if (this.orderItemId) {
        const updatePayload: UpdateOrderItem = {
          item_type: formValue.item_type,
          item_id: formValue.item_id,
          quantity: formValue.quantity,
          unit_price: formValue.unit_price,
          discount_amount: formValue.discount_amount,
          tax_amount: formValue.tax_amount,
          total_price: formValue.total_price,
          notes: formValue.notes
        };
        
        await this.orderItemsService.updateOrderItemAsync(this.orderItemId, updatePayload);
      } else {
        const createPayload: CreateOrderItem = {
          order_id: formValue.order_id!,
          item_type: formValue.item_type!,
          item_id: formValue.item_id!,
          quantity: formValue.quantity || 1,
          unit_price: formValue.unit_price!,
          discount_amount: formValue.discount_amount || 0,
          tax_amount: formValue.tax_amount || 0,
          total_price: formValue.total_price!,
          notes: formValue.notes
        };
        
        await this.orderItemsService.createOrderItemAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/order-items']);
    } catch (error: any) {
      console.error('Error saving order item:', error);
      this.error = this.orderItemId ? 'Failed to update order item' : 'Failed to create order item';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.orderItemForm.reset();
    this.orderItemId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/order-items']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.orderItemForm.controls).forEach(key => {
      const control = this.orderItemForm.get(key);
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