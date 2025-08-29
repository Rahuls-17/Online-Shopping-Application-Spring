import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/categories';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.loadCategories().subscribe();
  }
  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(categories => this.categoriesSubject.next(categories))
    );
  }

  createCategory(categoryData: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData).pipe(
      tap(() => this.loadCategories().subscribe())
    );
  }

  updateCategory(id: number, categoryData: { name: string }): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, categoryData).pipe(
      tap(() => this.loadCategories().subscribe())
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadCategories().subscribe())
    );
  }
}