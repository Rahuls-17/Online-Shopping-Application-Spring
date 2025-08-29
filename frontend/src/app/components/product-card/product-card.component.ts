import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isWishlisted: boolean = false;
  @Output() wishlistChange = new EventEmitter<void>();

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  viewDetails(): void {
    this.router.navigate(['/product', this.product.id]);
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
  }

  toggleWishlist(): void {
    const operation = this.isWishlisted
      ? this.wishlistService.removeFromWishlist(this.product.id)
      : this.wishlistService.addToWishlist(this.product.id);

    operation.subscribe({
      next: () => {
        const message = this.isWishlisted ? 'Removed from wishlist' : 'Added to wishlist';
        this.toastService.show(message, 'success');
        this.wishlistChange.emit();
      },
      error: (err: any) => this.toastService.show(err.error?.message || 'Could not update wishlist.', 'error')
    });
  }
}