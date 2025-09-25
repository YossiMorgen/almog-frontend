import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../services/products.service';
import { Product } from '../../../../models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  providers: [ProductsService],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  productId: number | null = null;
  currentUser: any = null;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.loading = true;
    this.error = null;

    this.productsService.getProduct(this.productId).subscribe({
      next: (response: any) => {
        this.product = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load product';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/crm/products', this.product.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/crm/products']);
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '-';
    return `$${price.toFixed(2)}`;
  }

  getStatusText(isActive: boolean | undefined): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  }

  getCategoryDisplay(category: string | undefined): string {
    if (!category) return 'Not specified';
    
    const categoryMap: { [key: string]: string } = {
      'equipment': 'Equipment',
      'clothing': 'Clothing',
      'accessories': 'Accessories',
      'supplies': 'Supplies',
      'other': 'Other'
    };
    
    return categoryMap[category] || category;
  }
}