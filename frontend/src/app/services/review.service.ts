import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProductReview, RatingSummary } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = '/api/reviews';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getReviewsForProduct(productId: number): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.apiUrl}/product/${productId}`);
  }

  addReview(reviewData: any): Observable<ProductReview> {
    return this.http.post<ProductReview>(this.apiUrl, reviewData);
  }

  canReview(productId: number): Observable<{ canReview: boolean }> {
    if (!this.authService.isLoggedIn()) {
      return of({ canReview: false });
    }
    const params = new HttpParams().set('productId', productId.toString());
    return this.http.get<{ canReview: boolean }>(`${this.apiUrl}/can-review`, { params });
  }

  getRatingSummary(productId: number): Observable<RatingSummary> {
    return this.http.get<RatingSummary>(`${this.apiUrl}/summary/${productId}`);
  }
}
