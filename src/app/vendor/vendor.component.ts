import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService} from '../vendor.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';


@Component({
  selector: 'app-vendor',
  standalone:true,
  imports:[FormsModule,ReactiveFormsModule,CommonModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Default setting

})
export class VendorComponent {
  productForm: FormGroup;
  currentAction: string = 'create'; // Set the initial action to 'create'

  constructor(private fb: FormBuilder, private productService: ProductService,private userService:UserService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      categoryId: ['', Validators.required],
      vendorId: ['', Validators.required],
      stockQuantity: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.productService.createProduct(newProduct).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          alert('Product created successfully!');
          this.productForm.reset(); // Clear the form after successful creation
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product. Please try again.');
        }
      });
    }
  }

  // Your existing methods...

  // Add methods to handle different actions
  createProduct() {
    this.currentAction = 'create';
  }

  viewProducts() {
    this.currentAction = 'products';
  }

  updateProduct() {
    this.currentAction = 'update';
  }

  deleteProduct() {
    this.currentAction = 'delete';
  }

  viewReviews() {
    this.currentAction = 'reviews';
  }

  checkStock() {
    this.currentAction = 'stock';
  }
  signOut(){
    this.userService.signOut();


  }
}
