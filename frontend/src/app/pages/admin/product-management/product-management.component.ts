import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Category } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { Page } from '../../../models/page.model';

declare var bootstrap: any;

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  isEditMode = false;
  currentProductId: number | null = null;
  productModal: any;
  imagePreviews: string[] = [];
  isUploading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  private categoriesSubscription!: Subscription;

  constructor(
    private adminService: AdminService,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [null, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      category: [null, Validators.required],
      specifications: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.categoriesSubscription = this.categoryService.categories$.subscribe(data => {
        this.categories = data;
    });
    this.productModal = new bootstrap.Modal(document.getElementById('productModal'));
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
        this.categoriesSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.adminService.getProductsPaginated(this.currentPage, this.pageSize).subscribe(page => {
    this.products = page.content;
    this.totalElements = page.totalElements;
    });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.loadProducts();
  }

  openEditProductModal(product: Product): void {
    this.isEditMode = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
        ...product,
        category: product.category.id
    });
    this.imagePreviews = product.images ? product.images.map(img => img.imageUrl) : [];
    if (product.imageUrl && !this.imagePreviews.includes(product.imageUrl)) {
        this.imagePreviews.unshift(product.imageUrl);
    }
    this.productModal.show();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);
        this.http.post<{ url: string }>('/api/uploads', formData).subscribe({
            next: (response) => {
                this.imagePreviews.push(response.url);
                this.isUploading = false;
            },
            error: () => {
                this.toastService.show('Image upload failed.', 'error');
                this.isUploading = false;
            }
        });
    }
  }

  addImageByUrl(imageUrlInput: HTMLInputElement): void {
    const url = imageUrlInput.value;
    if (url && url.startsWith('http')) {
        this.imagePreviews.push(url);
        imageUrlInput.value = '';
    } else {
        this.toastService.show('Please enter a valid URL.', 'error');
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  openNewProductModal(): void {
    this.isEditMode = false;
    this.productForm.reset({ category: null });
    this.currentProductId = null;
    this.imagePreviews = [];
    this.productModal.show();
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
        this.toastService.show('Please fill in all required fields.', 'error');
        return;
    }
    const formValue = this.productForm.value;
    const productData = {
        ...formValue,
        category: { id: formValue.category },
        imageUrl: this.imagePreviews.length > 0 ? this.imagePreviews[0] : null,
        images: this.imagePreviews.map(url => ({ imageUrl: url }))
    };
    const operation = this.isEditMode
        ? this.adminService.updateProduct(this.currentProductId!, productData)
        : this.adminService.createProduct(productData);

    operation.subscribe({
        next: () => {
            this.toastService.show(`Product ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'success');
            this.loadProducts();
            this.productModal.hide();
        },
        error: (err) => this.toastService.show(err.error?.message || 'An error occurred.', 'error')
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
        this.adminService.deleteProduct(productId).subscribe({
            next: (response) => {
                this.toastService.show(response.message, 'success');
                this.loadProducts();
            },
            error: (err) => this.toastService.show(err.error?.message || 'Failed to delete product.', 'error')
        });
    }
  }
}