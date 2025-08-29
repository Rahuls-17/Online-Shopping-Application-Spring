import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load order history', err);
        this.isLoading = false;
      }
    });
  }
}