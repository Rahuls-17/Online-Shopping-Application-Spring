import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentBanner } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class PublicContentService {
  private apiUrl = '/api/content';

  constructor(private http: HttpClient) { }

  getActiveBanners(position: string): Observable<ContentBanner[]> {
    const params = new HttpParams().set('position', position);
    return this.http.get<ContentBanner[]>(`${this.apiUrl}/banners`, { params });
  }
}