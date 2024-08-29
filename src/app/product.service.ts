import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Product } from './product';
import { Vendor } from './vendor';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private vendorApiUrl = 'http://localhost:8080/api/vendors'; // Assuming this is the Vendor service URL


  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getProductWithVendor(id: string): Observable<any> {
    return forkJoin({
      product: this.http.get<Product>(`${this.apiUrl}/${id}`),
      vendor: this.http.get<Vendor>(`${this.vendorApiUrl}/vendor/${id}`) // Fetch vendor using vendorId from product
    });
  }
}
