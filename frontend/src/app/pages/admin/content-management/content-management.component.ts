import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService, ContentBanner } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent implements OnInit {
  banners: ContentBanner[] = [];
  bannerForm: FormGroup;
  isEditMode = false;
  currentBannerId: number | null = null;
  bannerModal: any;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastService: ToastService,
    private http: HttpClient
  ) {
    this.bannerForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      linkUrl: [''],
      active: [true],
      position: ['homepage-top', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBanners();
    setTimeout(() => {
      this.bannerModal = new bootstrap.Modal(document.getElementById('bannerModal'));
    });
  }

  loadBanners(): void {
    this.adminService.getAllBanners().subscribe(data => this.banners = data);
  }

  openNewBannerModal(): void {
    this.isEditMode = false;
    this.bannerForm.reset({ active: true, position: 'homepage-top' });
    this.currentBannerId = null;
    this.bannerModal.show();
  }

  openEditBannerModal(banner: ContentBanner): void {
    this.isEditMode = true;
    this.currentBannerId = banner.id;
    this.bannerForm.patchValue(banner);
    this.bannerModal.show();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', file);
      this.http.post<{ url: string }>('/api/uploads', formData).subscribe({
        next: (response) => {
          this.bannerForm.patchValue({ imageUrl: response.url });
          this.isUploading = false;
          this.toastService.show('Image uploaded successfully!', 'success');
        },
        error: () => {
          this.toastService.show('Image upload failed.', 'error');
          this.isUploading = false;
        }
      });
    }
  }

  saveBanner(): void {
    if (this.bannerForm.invalid) {
      this.toastService.show('Please fill in all required fields.', 'error');
      return;
    }

    const bannerData = this.bannerForm.value;
    const operation = this.isEditMode
      ? this.adminService.updateBanner(this.currentBannerId!, bannerData)
      : this.adminService.createBanner(bannerData);

    operation.subscribe({
      next: () => {
        this.toastService.show(`Banner ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'success');
        this.loadBanners();
        this.bannerModal.hide();
      },
      error: (err) => this.toastService.show(err.error?.message || 'An error occurred.', 'error')
    });
  }

  deleteBanner(bannerId: number): void {
      if (confirm('Are you sure you want to delete this banner?')) {
          this.adminService.deleteBanner(bannerId).subscribe({
              next: () => {
                  this.toastService.show('Banner deleted successfully!', 'success');
                  this.loadBanners();
              },
              error: (err) => this.toastService.show(err.error?.message || 'Failed to delete banner.', 'error')
          });
      }
  }
}