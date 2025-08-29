import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (authService.isLoggedIn() && token) {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      if (decodedToken.role === 'ADMIN') {
        return true;
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  router.navigate(['/home']);
  return false;
};
