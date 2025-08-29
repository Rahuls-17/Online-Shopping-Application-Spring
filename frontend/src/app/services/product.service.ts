import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products'; // Using proxy

  constructor(private http: HttpClient) { }

  // Updated to accept a filter object
  getProducts(filters: any): Observable<Product[]> {
    let params = new HttpParams();
    // Dynamically append parameters if they exist
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== '') {
        params = params.append(key, value.toString());
      }
    });

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
