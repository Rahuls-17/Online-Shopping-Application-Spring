import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface WishlistItem {
  id: number;
  product: any;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = '/api/wishlist';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  getWishlist(): Observable<WishlistItem[]> {
    const userId = this.getUserId();
    if (!userId) return of([]);
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/${userId}`);
  }

  addToWishlist(productId: number): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return of(null);
    
    // FIX: Changed this from a plain object to use HttpParams
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString());
      
    return this.http.post(`${this.apiUrl}/add`, {}, { params });
  }

  removeFromWishlist(productId: number): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return of(null);
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString());
      
    return this.http.delete(`${this.apiUrl}/remove`, { params });
  }
}