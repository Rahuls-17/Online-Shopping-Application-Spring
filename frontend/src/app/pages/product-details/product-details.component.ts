import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { Product, ProductReview, RatingSummary } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  reviews: ProductReview[] = [];
  reviewForm: FormGroup;
  isLoading = true;
  errorMessage: string = '';
  currentImageIndex = 0;
  quantity: number = 1;
  canLeaveReview = false;
  parsedSpecifications: { [key: string]: string } | null = null;
  
  // This property is now correctly declared
  ratingSummary: RatingSummary | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductAndReviews(+productId);
    }
  }

  loadProductAndReviews(id: number): void {
    this.isLoading = true;
    forkJoin({
      product: this.productService.getProductById(id),
      reviews: this.reviewService.getReviewsForProduct(id),
      eligibility: this.reviewService.canReview(id),
      summary: this.reviewService.getRatingSummary(id)
    }).subscribe({
      next: ({ product, reviews, eligibility, summary }) => {
        this.product = product;
        this.reviews = reviews;
        this.canLeaveReview = eligibility.canReview;
        this.ratingSummary = summary;
        
        this.parseSpecifications();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Could not load product details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getRatingPercentage(count: number): number {
    if (!this.ratingSummary || this.ratingSummary.totalRatingCount === 0) {
      return 0;
    }
    return (count / this.ratingSummary.totalRatingCount) * 100;
  }

  private parseSpecifications(): void {
    this.parsedSpecifications = null; 
    if (this.product && this.product.specifications) {
      try {
        this.parsedSpecifications = JSON.parse(this.product.specifications);
      } catch (e) {
        console.error('Failed to parse product specifications JSON:', e);
      }
    }
  }

  getSpecKeys(): string[] {
    return this.parsedSpecifications ? Object.keys(this.parsedSpecifications) : [];
  }

  get currentImageUrl(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[this.currentImageIndex].imageUrl;
    }
    return this.product?.imageUrl || 'https://placehold.co/600x400?text=No+Image';
  }

  nextImage(): void {
    if (this.product?.images && this.product.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage(): void {
    if (this.product?.images && this.product.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }

  updateQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    if (this.product && newQuantity >= 1 && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
    }
  }

  addToWishlist(): void {
    if (this.product) {
      this.wishlistService.addToWishlist(this.product.id).subscribe({
        next: () => this.toastService.show('Product added to wishlist!', 'success'),
        error: (err: any) => this.toastService.show(err.error?.message || 'Could not add to wishlist.', 'error')
      });
    }
  }

  submitReview(): void {
    if (!this.canLeaveReview) {
        this.toastService.show('You must purchase this item to leave a review.', 'error');
        return;
    }
    if (this.reviewForm.invalid || !this.product) return;

    const reviewData = {
      ...this.reviewForm.value,
      product: { id: this.product.id },
    };

    this.reviewService.addReview(reviewData).subscribe({
      next: () => {
        this.toastService.show('Review submitted successfully!', 'success');
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.loadProductAndReviews(this.product!.id);
      },
      error: (err: any) => {
        this.toastService.show(err.error?.message || 'Failed to submit review.', 'error');
      }
    });
  }
}
