import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../services/products.service';
import { Product, CreateProduct, UpdateProduct } from '../../../../models/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-product-form',
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
    MatCheckboxModule
  ],
  providers: [ProductsService],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  loading = false;
  error: string | null = null;
  productId: number | null = null;

  categoryOptions = [
    { value: 'equipment', label: 'Equipment' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other' }
  ];

  productForm!: FormGroup;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = +params['id'];
        this.loadProduct();
      }
    });

    this.productForm = this.formBuilder.group({
      sku: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      description: [''],
      category: [''],
      price: [null as number | null, [Validators.required, Validators.min(0.01)]],
      tax_rate: [0, [Validators.min(0), Validators.max(100)]],
      stock_quantity: [0, [Validators.min(0)]],
      is_active: [true, [Validators.required]],
      image_url: ['']
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.loading = true;
    this.productsService.getProduct(this.productId).subscribe({
      next: (response: any) => {
        const productData = response.data;
        this.productForm.patchValue({
          sku: productData.sku,
          name: productData.name,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          tax_rate: productData.tax_rate,
          stock_quantity: productData.stock_quantity,
          is_active: productData.is_active,
          image_url: productData.image_url
        });
        this.productForm.markAsPristine();
        this.productForm.markAsUntouched();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load product';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  async submitForm(): Promise<void> {
    this.productForm.markAllAsTouched();
    
    if (!this.productForm.valid) {
      console.error('Form validation errors:', this.getFormValidationErrors());
      return;
    }
    
    this.loading = true;
    this.error = null;

    try {
      const formValue = this.productForm.value;
      
      if (this.productId) {
        const updatePayload: UpdateProduct = {
          sku: formValue.sku,
          name: formValue.name,
          description: formValue.description,
          category: formValue.category,
          price: formValue.price,
          tax_rate: formValue.tax_rate,
          stock_quantity: formValue.stock_quantity,
          is_active: formValue.is_active,
          image_url: formValue.image_url
        };
        
        await this.productsService.updateProductAsync(this.productId, updatePayload);
      } else {
        const createPayload: CreateProduct = {
          sku: formValue.sku!,
          name: formValue.name!,
          description: formValue.description,
          category: formValue.category,
          price: formValue.price!,
          tax_rate: formValue.tax_rate || 0,
          stock_quantity: formValue.stock_quantity || 0,
          is_active: formValue.is_active !== false,
          image_url: formValue.image_url
        };
        
        await this.productsService.createProductAsync(createPayload);
      }
      
      this.resetForm();
      this.router.navigate(['/crm/products']);
    } catch (error: any) {
      console.error('Error saving product:', error);
      this.error = this.productId ? 'Failed to update product' : 'Failed to create product';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.productForm.reset();
    this.productId = null;
  }

  onCancel(): void {
    this.router.navigate(['/crm/products']);
  }

  private getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
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

