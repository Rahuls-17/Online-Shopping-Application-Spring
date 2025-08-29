import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isLoading = false;
  private cartSubscription!: Subscription;
  private profileSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart.items;
      this.totalPrice = cart.totalPrice;
      if (this.cartItems.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    // Pre-fill form with user profile data if available
    this.userService.getProfile().subscribe(profile => {
      if (profile) {
        this.checkoutForm.patchValue(profile);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
  
  proceedToPayment(): void {
    if (this.checkoutForm.invalid) {
      this.toastService.show('Please fill in all required shipping details.', 'error');
      return;
    }
    
    this.isLoading = true;
    const shippingDetails = this.checkoutForm.getRawValue();
    this.orderService.setPendingOrderDetails(shippingDetails);
    setTimeout(() => {
        this.router.navigate(['/payment', `mock_session_${Date.now()}`]);
    }, 1000);
  }
}