import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Order, OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service'; // Import ToastService

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  isLoading = true;
  order: Order | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastService: ToastService // Inject ToastService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(+orderId).subscribe({
        next: (orderData) => {
          this.order = orderData;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Could not load order details.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No order ID provided.';
      this.isLoading = false;
    }
  }

  printInvoice(): void {
    window.print();
  }

  // FIX: Implement the actual logic for resending the email
  resendEmail(): void {
    if (!this.order) return;

    this.toastService.show('Resending email...', 'success');
    this.orderService.resendConfirmationEmail(this.order.id).subscribe({
      next: (response) => {
        this.toastService.show(response.message, 'success');
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to resend email.', 'error');
      }
    });
  }
}