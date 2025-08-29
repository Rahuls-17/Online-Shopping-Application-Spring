import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Observable, Subscription } from 'rxjs';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

interface DecodedToken {
  role: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAdmin = false;

  cart$: Observable<Cart>;
  private authSubscription!: Subscription;

  constructor(
    public authService: AuthService, 
    private router: Router,
    private cartService: CartService
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthState().subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.checkAdminRole();
      } else {
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  checkAdminRole(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        this.isAdmin = decodedToken.role === 'ADMIN';
      } catch (error) {
        this.isAdmin = false;
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
