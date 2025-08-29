import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ProductReviewAdmin } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.scss']
})
export class ReviewManagementComponent implements OnInit {
  reviews: ProductReviewAdmin[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.adminService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Failed to load reviews.', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.adminService.deleteReview(reviewId).subscribe({
        next: () => {
          this.toastService.show('Review deleted successfully!', 'success');
          this.loadReviews();
        },
        error: (err) => this.toastService.show(err.error?.message || 'Failed to delete review.', 'error')
      });
    }
  }
}