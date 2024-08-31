import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from './vendor';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://localhost:5002/api/vendors'; 

  constructor(private http: HttpClient,private router:Router) {}

  registerVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/register`, vendor);
  }
  updateVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/update/${vendor.id}`, vendor);
  }

  getVendorById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${vendorId}`);
  }

  listVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/list`);
  }
  loginVendor(contactMail: string, password: string): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/login`, { contactMail, password });
  }
  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('vendorId');
    this.router.navigate(['/landing']);
  }
}
