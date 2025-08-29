import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service'; // Use CategoryService
import { Category } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditMode = false;
  currentCategoryId: number | null = null;
  categoryModal: any;
  private categoriesSubscription!: Subscription;

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryService.categories$.subscribe(data => {
      this.categories = data;
    });
    this.categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  openNewCategoryModal(): void {
    this.isEditMode = false;
    this.categoryForm.reset();
    this.currentCategoryId = null;
    this.categoryModal.show();
  }

  openEditCategoryModal(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({ name: category.name });
    this.categoryModal.show();
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;

    const categoryData = this.categoryForm.value;
    const operation = this.isEditMode
      ? this.categoryService.updateCategory(this.currentCategoryId!, categoryData)
      : this.categoryService.createCategory(categoryData);

    operation.subscribe({
      next: () => {
        this.toastService.show(`Category ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'success');
        this.categoryModal.hide();
      },
      error: (err) => this.toastService.show(err.error?.message || 'An error occurred.', 'error')
    });
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.toastService.show('Category deleted successfully!', 'success');
        },
        error: (err) => this.toastService.show(err.error?.message || 'Failed to delete category.', 'error')
      });
    }
  }
}