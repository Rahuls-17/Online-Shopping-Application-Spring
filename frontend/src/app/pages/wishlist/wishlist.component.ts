import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  wishlistedProductIds = new Set<number>();
  isLoading = true;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.wishlistedProductIds = new Set(items.map(item => item.product.id));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onWishlistChange(): void {
    this.loadWishlist();
  }
}
