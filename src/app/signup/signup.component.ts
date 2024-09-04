import { UserService } from '../user.service';
import { VendorService } from '../vendor.service';
import { User } from '../user';
import { Vendor } from '../vendor';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  role: string = '';  // Track the selected role
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  // Common user data
  formData: User = {
    username: '',
    password: '',
    email: '',
    phone: '',
    address: ''
  };

  // Vendor-specific data
  vendorData: Vendor = {
    name: '',
    description: '',
    contactMail: '',
    contactPhone: '',
    website: '',
    city: '',
    password:'',
    gstno:''
  };

  constructor(
    private userService: UserService,
    private vendorService: VendorService,
    private router: Router
  ) {}

  onRoleChange() {
    // Reset fields based on the selected role
    if (this.role === 'Vendor') {
      this.formData.username = '';
      this.formData.password = '';
    } else if (this.role === 'User') {
      this.vendorData.name = '';
      this.vendorData.password = '';
    }
  }

  onSignup(form: NgForm) {
    if (this.role === 'User' && this.formData.password !== this.confirmPassword ||
        this.role === 'Vendor' && this.vendorData.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;  // Prevent form submission if passwords do not match
    }

    this.passwordMismatch = false;

    if (form.valid) {
      if (this.role === 'Vendor') {
        // Register as Vendor
        console.log('Vendor Data being sent:', this.vendorData);
        this.vendorService.registerVendor(this.vendorData).subscribe({
          next: (response) => {
            console.log('Vendor registered successfully:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error registering vendor:', error);
          }
        });
      } else if (this.role === 'User') {
        // Register as User
        console.log('User Data being sent:', this.formData);
        this.userService.registerUser(this.formData).subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error registering user:', error);
          }
        });
      }
    }
  }
}
