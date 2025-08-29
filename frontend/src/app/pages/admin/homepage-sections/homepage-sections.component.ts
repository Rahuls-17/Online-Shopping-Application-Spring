import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomepageSection, Product } from '../../../models/product.model';
import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';
import { forkJoin } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-homepage-sections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './homepage-sections.component.html',
})
export class HomepageSectionsComponent implements OnInit {
  sections: HomepageSection[] = [];
  allProducts: Product[] = [];
  sectionForm: FormGroup;
  isEditMode = false;
  currentSectionId: number | null = null;
  sectionModal: any;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private productService: ProductService,
    private toastService: ToastService
  ) {
    this.sectionForm = this.fb.group({
      title: ['', Validators.required],
      sectionOrder: [0, [Validators.required, Validators.min(1)]],
      productIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.sectionModal = new bootstrap.Modal(document.getElementById('sectionModal'));
  }

  loadData(): void {
    forkJoin({
      sections: this.adminService.getHomepageSections(),
      products: this.productService.getProducts({})
    }).subscribe(({ sections, products }) => {
      this.sections = sections.sort((a, b) => a.sectionOrder - b.sectionOrder);
      this.allProducts = products;
    });
  }

  openSectionModal(section?: HomepageSection): void {
    if (section) {
      this.isEditMode = true;
      this.currentSectionId = section.id;
      this.sectionForm.patchValue(section);
    } else {
      this.isEditMode = false;
      this.currentSectionId = null;
      
      const nextOrder = this.sections.length > 0
          ? Math.max(...this.sections.map(s => s.sectionOrder)) + 1
          : 1;
          
      this.sectionForm.reset({ productIds: [], sectionOrder: nextOrder });
    }
    this.sectionModal.show();
  }

  saveSection(): void {
    if (this.sectionForm.invalid) {
      this.toastService.show('Please fill in all required fields.', 'error');
      return;
    }
    const sectionData = this.sectionForm.value;
    const operation = this.isEditMode
      ? this.adminService.updateHomepageSection(this.currentSectionId!, sectionData)
      : this.adminService.createHomepageSection(sectionData);

    operation.subscribe({
      next: () => {
        this.toastService.show(`Section ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'success');
        this.loadData();
        this.sectionModal.hide();
      },
      error: (err: any) => this.toastService.show(err.error?.message || 'An error occurred.', 'error')
    });
  }

  deleteSection(id: number): void {
    if (confirm('Are you sure you want to delete this section?')) {
      this.adminService.deleteHomepageSection(id).subscribe({
        next: () => {
          this.toastService.show('Section deleted successfully!', 'success');
          this.loadData();
        },
        error: (err: any) => this.toastService.show(err.error?.message || 'Failed to delete section.', 'error')
      });
    }
  }
}