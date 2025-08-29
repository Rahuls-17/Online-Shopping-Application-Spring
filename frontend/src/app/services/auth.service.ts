import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

interface DecodedToken {
  id: number;
  sub: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router) { }
  
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this.authState.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  
  getCurrentUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        return decodedToken.id;
      } catch (error) {
        console.error("Failed to decode token", error);
        return null;
      }
    }
    return null;
  }
}

