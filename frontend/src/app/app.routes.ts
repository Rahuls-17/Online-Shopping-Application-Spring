import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartViewComponent } from './pages/cart-view/cart-view.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';

export const routes: Routes = [ 
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'home', component: HomeComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartViewComponent, canActivate: [authGuard] },
    { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'payment/:sessionId', component: PaymentComponent, canActivate: [authGuard] },
    { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [authGuard] },
    { path: 'order-confirmation/:id', component: OrderConfirmationComponent, canActivate: [authGuard] },
    { path: 'order-history', component: OrderHistoryComponent, canActivate: [authGuard] },
    { path: 'admin', component: DashboardComponent, canActivate: [authGuard, adminGuard] },
    { path: 'order-details/:id', component: OrderDetailsComponent, canActivate: [authGuard] },
    
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];