import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

class User {
  constructor(
    public username: string,
    public password: string,
    public email: string,
    public phone: string = '',
    public address: string = ''  // Added role field
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private formData: {
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
  } | null = null;
  private apiUrl = 'http://localhost:5001/api/users';  // Adjust this URL based on your backend configuration

  constructor(private http: HttpClient,private router:Router) {}  // Inject HttpClient for making HTTP requests

  setFormData(data: {
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
  }) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }


 
  registerUser(user: User): Observable<User> {

    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }
  signOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}

