import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { WishlistService } from '../services/wishlist.service';
import { Product, Category, HomepageSection } from '../models/product.model';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { PublicContentService } from '../services/public-content.service';
import { AdminService, ContentBanner } from '../services/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  categories: Category[] = [];
  wishlistedProductIds = new Set<number>();
  filterForm: FormGroup;
  banners: ContentBanner[] = [];
  homepageSections: HomepageSection[] = [];

  private categoriesSubscription!: Subscription;
  private filterSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private categoryService: CategoryService,
    private publicContentService: PublicContentService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      keyword: [''],
      categoryId: [null],
      brand: [''],
      minPrice: [null],
      maxPrice: [null],
      minRating: [null]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.filterSubscription = this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadHomepageContent();
    });
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    this.loadBanners();
    this.loadWishlist();
    this.loadCategories();
    this.loadHomepageContent();
  }

  loadBanners(): void {
    this.publicContentService.getActiveBanners('homepage-top').subscribe(data => {
      this.banners = data;
    });
  }

  loadCategories(): void {
    this.categoriesSubscription = this.categoryService.categories$.subscribe(data => {
        this.categories = data;
    });
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe(items => {
      this.wishlistedProductIds = new Set(items.map(item => item.product.id));
    });
  }

  onWishlistChange(): void {
    this.loadWishlist();
  }

  loadHomepageContent(): void {
    this.productService.getProducts(this.filterForm.value).subscribe(allProducts => {
      this.allProducts = allProducts;
      const productMap = new Map(allProducts.map(p => [p.id, p]));
      this.adminService.getHomepageSections().subscribe(sections => {
        this.homepageSections = sections.map(section => ({
          ...section,
          products: section.productIds
            .map((id: number) => productMap.get(id))
            .filter((p?: Product): p is Product => !!p)
        }));
      });
    });
  }
}