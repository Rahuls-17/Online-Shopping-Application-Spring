import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

export interface Order {
  id: number;
  user: { id: number; name: string; email: string; };
  totalAmount: number;
  status: string;
  createdAt: string;
  address: string;
  items: { productName: string; quantity: number; price: number; }[];
  cancellationReason: string | null;
  refunded: boolean;
}

interface PendingOrder {
  shippingAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/orders';
  private pendingOrderSubject = new BehaviorSubject<PendingOrder | null>(null);

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  setPendingOrderDetails(details: { address: string; }): void {
    this.pendingOrderSubject.next({ shippingAddress: details.address });
  }

  placeOrder(): Observable<Order> {
    const pendingOrder = this.pendingOrderSubject.getValue();
    const userId = this.authService.getCurrentUserId();
    const cart = this.cartService.getValue();

    if (!pendingOrder || !userId || cart.items.length === 0) {
      return throwError(() => new Error('Missing order details. Please start checkout again.'));
    }

    const orderPayload = {
      userId: userId,
      address: pendingOrder.shippingAddress
    };

    return this.http.post<Order>(this.apiUrl, orderPayload).pipe(
      tap(() => {
        this.cartService.clearCart();
        this.pendingOrderSubject.next(null);
      })
    );
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/details/${orderId}`);
  }

  getOrderHistory(): Observable<Order[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in.'));
    }
    return this.http.get<Order[]>(`${this.apiUrl}/${userId}`);
  }

  resendConfirmationEmail(orderId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${orderId}/resend-confirmation`, {});
  }
}