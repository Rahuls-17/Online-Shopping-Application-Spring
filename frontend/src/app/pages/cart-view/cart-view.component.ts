import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent {
  cart$: Observable<Cart>;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.cart$;
  }

  updateQuantity(item: CartItem, newQuantity: string | number): void {
    const quantity = typeof newQuantity === 'string' ? parseInt(newQuantity, 10) : newQuantity;
    if (!isNaN(quantity) && quantity >= 1) {
      this.cartService.updateItemQuantity(item.productId, quantity);
    } else if (!isNaN(quantity) && quantity <= 0) {
      this.removeItem(item.productId);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  clearCart(): void {
    if(confirm('Are you sure you want to clear your entire cart?')) {
        this.cartService.clearCart();
    }
  }

  moveToWishlist(productId: number): void {
    this.cartService.moveToWishlist(productId);
  }
}
