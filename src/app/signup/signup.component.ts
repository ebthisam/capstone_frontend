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
    private router:Router
  ) {}

  onRoleChange() {
    // Reset specific fields based on role change
    if (this.role === 'Vendor') {
      this.formData.email = '';
      this.formData.phone = '';
    } else if (this.role === 'User') {
      this.vendorData.contactMail = '';
      this.vendorData.contactPhone = '';
    }
  }

  onSignup(form: NgForm) {
    if (this.formData.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return; // Prevent form submission if passwords do not match
    }
  
    this.passwordMismatch = false;
  
    if (form.valid) {
      if (this.role === 'Vendor') {
        // Debugging log
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
