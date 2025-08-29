import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  isProcessing = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService
  ) {}

  processSuccessfulPayment(): void {
    this.isProcessing = true;
    this.toastService.show('Payment successful! Placing your order...', 'success');
    
    this.orderService.placeOrder().subscribe({
      // FIX: Use the 'id' from the returned order object for navigation.
      next: (confirmedOrder) => {
        this.router.navigate(['/order-confirmation', confirmedOrder.id]);
      },
      error: (err) => {
        this.isProcessing = false;
        this.toastService.show(err.error?.message || 'Failed to confirm order.', 'error');
        this.router.navigate(['/cart']);
      }
    });
  }

  cancelPayment(): void {
    this.toastService.show('Payment was cancelled.', 'error');
    this.router.navigate(['/cart']);
  }
}