import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

export interface BackendCartItem {
  id: number;
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = '/api/cart';
  private cartSubject = new BehaviorSubject<Cart>({ items: [], totalPrice: 0, totalItems: 0 });
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.authService.getAuthState().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadCart().subscribe();
      } else {
        this.cartSubject.next({ items: [], totalPrice: 0, totalItems: 0 });
      }
    });
  }
  
  getValue(): Cart {
    return this.cartSubject.getValue();
  }

  loadCart(): Observable<Cart> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of({ items: [], totalPrice: 0, totalItems: 0 });

    return this.http.get<BackendCartItem[]>(`${this.apiUrl}/${userId}`).pipe(
      map(backendItems => {
        const cart = this._transformBackendItems(backendItems);
        this.cartSubject.next(cart);
        return cart;
      }),
      catchError(() => {
        const emptyCart = { items: [], totalPrice: 0, totalItems: 0 };
        this.cartSubject.next(emptyCart);
        return of(emptyCart);
      })
    );
  }

  addToCart(product: Product, quantity: number): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.toastService.show('You must be logged in.', 'error');
      return;
    }

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', product.id.toString())
      .set('quantity', quantity.toString());

    this.http.post<BackendCartItem>(`${this.apiUrl}/add`, null, { params }).pipe(
      switchMap(() => this.loadCart())
    ).subscribe({
      next: () => this.toastService.show(`${product.name} added to cart!`, 'success'),
      error: err => this.toastService.show(err.error?.message || 'Could not add to cart.', 'error')
    });
  }

  removeItem(productId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString());
      
    this.http.delete(`${this.apiUrl}/remove`, { params }).pipe(
      switchMap(() => this.loadCart())
    ).subscribe({
      next: () => this.toastService.show('Item removed from cart.', 'success'),
      error: err => this.toastService.show(err.error?.message || 'Could not remove item.', 'error')
    });
  }

  updateItemQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

    this.http.put<BackendCartItem>(`${this.apiUrl}/update`, null, { params }).pipe(
      switchMap(() => this.loadCart())
    ).subscribe({
      error: err => this.toastService.show(err.error?.message || 'Could not update quantity.', 'error')
    });
  }

  clearCart(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.http.delete(`${this.apiUrl}/${userId}/clear`).pipe(
      switchMap(() => this.loadCart())
    ).subscribe({
      next: () => this.toastService.show('Cart cleared.', 'success'),
      error: err => this.toastService.show(err.error?.message || 'Could not clear cart.', 'error')
    });
  }

  moveToWishlist(productId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString());

    this.http.post(`${this.apiUrl}/move-to-wishlist`, null, { params }).pipe(
      switchMap(() => this.loadCart())
    ).subscribe({
      next: () => this.toastService.show('Item moved to wishlist!', 'success'),
      error: err => this.toastService.show(err.error?.message || 'Could not move item.', 'error')
    });
  }

  private _transformBackendItems(backendItems: BackendCartItem[]): Cart {
    const items: CartItem[] = backendItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl || 'https://placehold.co/150x150?text=No+Image',
      quantity: item.quantity
    }));
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { items, totalItems, totalPrice };
  }
}