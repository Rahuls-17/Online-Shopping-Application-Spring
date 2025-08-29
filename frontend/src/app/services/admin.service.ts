import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, ProductReview, HomepageSection } from '../models/product.model';
import { UserProfile } from './user.service';
import { Order } from './order.service';
import { Page } from '../models/page.model';

export interface ContentBanner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  position: string;
  sectionOrder: number;
  productIds: number[];
}

export interface ProductReviewAdmin extends ProductReview {
  product: { name: string };
}

export interface SalesSummary {
  totalSales: number;
  totalOrders: number;
}

export interface PopularProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private usersApiUrl = '/api/users';
  private productsApiUrl = '/api/products';
  private categoriesApiUrl = '/api/categories';
  private ordersApiUrl = '/api/orders';
  private reportsApiUrl = '/api/reports';
  private contentApiUrl = '/api/admin/content';
  private reviewsApiUrl = '/api/reviews';
  private adminHomepageApiUrl = '/api/admin/homepage-sections';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.usersApiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.usersApiUrl}/${id}`);
  }

  createProduct(productData: any): Observable<Product> {
    return this.http.post<Product>(this.productsApiUrl, productData);
  }

  updateProduct(id: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.productsApiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.productsApiUrl}/${id}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesApiUrl);
  }
  
  createCategory(categoryData: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.categoriesApiUrl, categoryData);
  }

  updateCategory(id: number, categoryData: { name: string }): Observable<Category> {
    return this.http.put<Category>(`${this.categoriesApiUrl}/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.categoriesApiUrl}/${id}`);
  }

  toggleUserStatus(id: number): Observable<any> {
    return this.http.put(`${this.usersApiUrl}/${id}/toggle-status`, {});
  }

  updateUserRole(id: number, role: string): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.usersApiUrl}/${id}/role`, { role });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersApiUrl);
  }

  updateOrderStatus(orderId: number, status: string, reason?: string): Observable<any> {
    const payload = { status, reason };
    return this.http.put(`${this.ordersApiUrl}/${orderId}/status`, payload);
  }

  getSalesSummary(): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.reportsApiUrl}/sales-summary`);
  }

  getPopularProducts(): Observable<PopularProduct[]> {
    return this.http.get<PopularProduct[]>(`${this.reportsApiUrl}/popular-products`);
  }

  getAllBanners(): Observable<ContentBanner[]> {
    return this.http.get<ContentBanner[]>(`${this.contentApiUrl}/banners`);
  }

  createBanner(bannerData: ContentBanner): Observable<ContentBanner> {
    return this.http.post<ContentBanner>(`${this.contentApiUrl}/banners`, bannerData);
  }

  updateBanner(id: number, bannerData: ContentBanner): Observable<ContentBanner> {
    return this.http.put<ContentBanner>(`${this.contentApiUrl}/banners/${id}`, bannerData);
  }

  deleteBanner(id: number): Observable<any> {
      return this.http.delete(`${this.contentApiUrl}/banners/${id}`);
  }

  getAllReviews(): Observable<ProductReviewAdmin[]> {
    return this.http.get<ProductReviewAdmin[]>(this.reviewsApiUrl);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.reviewsApiUrl}/${id}`);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.ordersApiUrl}/${orderId}`);
  }

  getProductsPaginated(page: number, size: number): Observable<Page<Product>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Product>>(`${this.productsApiUrl}/admin`, { params });
  }

  getRecentReviews(): Observable<ProductReviewAdmin[]> {
    return this.http.get<ProductReviewAdmin[]>(`${this.reportsApiUrl}/recent-reviews`);
  }

  getHomepageSections(): Observable<HomepageSection[]> {
    return this.http.get<HomepageSection[]>(`/api/content/homepage-sections`);
  }

  createHomepageSection(sectionData: HomepageSection): Observable<HomepageSection> {
    return this.http.post<HomepageSection>(this.adminHomepageApiUrl, sectionData);
  }

  updateHomepageSection(id: number, sectionData: HomepageSection): Observable<HomepageSection> {
    return this.http.put<HomepageSection>(`${this.adminHomepageApiUrl}/${id}`, sectionData);
  }

  deleteHomepageSection(id: number): Observable<any> {
    return this.http.delete(`${this.adminHomepageApiUrl}/${id}`);
  }
}
