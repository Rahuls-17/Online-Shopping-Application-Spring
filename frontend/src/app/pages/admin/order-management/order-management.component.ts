import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Order } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  statuses: string[] = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  cancellationModal: any;
  cancellationForm: FormGroup;
  orderToCancel: Order | null = null;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.cancellationForm = this.fb.group({
      reason: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.cancellationModal = new bootstrap.Modal(document.getElementById('cancellationModal'));
  }

  loadOrders(): void {
    this.isLoading = true;
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastService.show('Failed to load orders.', 'error');
        this.isLoading = false;
      }
    });
  }

  onStatusChange(order: Order, newStatus: string): void {
    if (newStatus === 'CANCELLED') {
      this.orderToCancel = order;
      this.cancellationForm.reset();
      this.cancellationModal.show();
    } else {
      this.adminService.updateOrderStatus(order.id, newStatus).subscribe({
        next: () => {
          this.toastService.show(`Order #${order.id} status updated to ${newStatus}.`, 'success');
          this.loadOrders();
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'Failed to update order status.';
          this.toastService.show(errorMessage, 'error');
          this.loadOrders();
        }
      });
    }
  }

  submitCancellation(): void {
    if (!this.orderToCancel) return;

    const reason = this.cancellationForm.value.reason;
    this.adminService.updateOrderStatus(this.orderToCancel.id, 'CANCELLED', reason).subscribe({
      next: () => {
        this.toastService.show(`Order #${this.orderToCancel?.id} has been cancelled.`, 'success');
        this.loadOrders();
        this.cancellationModal.hide();
      },
      error: (err: any) => {
        const errorMessage = err.error?.message || 'Failed to cancel order.';
        this.toastService.show(errorMessage, 'error');
        this.loadOrders();
        this.cancellationModal.hide();
      }
    });
  }
  
  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      this.adminService.deleteOrder(orderId).subscribe({
        next: () => {
          this.toastService.show('Order deleted successfully.', 'success');
          this.loadOrders();
        },
        error: (err: any) => {
          this.toastService.show(err.error?.message || 'Failed to delete order.', 'error');
        }
      });
    }
  }
}
