import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users'; // Using proxy

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getProfile(): Observable<UserProfile | null> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of(null);
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  updateProfile(profileData: any): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of(null);
    return this.http.put(`${this.apiUrl}/${userId}`, profileData);
  }
}
