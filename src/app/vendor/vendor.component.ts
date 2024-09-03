import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../vendor.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../category.service';
import { error } from 'console';
import { Review } from '../review';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Default setting
})
export class VendorComponent implements OnInit {
  productForm: FormGroup;
  updateForm: FormGroup;
  currentAction: string = 'create'; // Set the initial action to 'create'
  categories: any[] = [];
  products: Product[] = []; // Store products for the current vendor
  updateForms: { [key: string]: FormGroup } = {}; // Store update forms for each product
  activeUpdateForm: string | null = null; // Track the currently active update form
  selectedProductReviews: Review[] = []; // Store reviews for the selected product
  selectedProductName: string = ''; // Store the name of the selected product



  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private vendorService: VendorService,
    private categoryService: CategoryService
  ) {
    const vendorId = localStorage.getItem('vendorId');
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required],
      categoryId: ['', Validators.required],
      vendorId: [{ value: vendorId, disabled: true }, Validators.required],
      stockQuantity: [null, Validators.required],
      imageUrl: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required],
      categoryId: ['', Validators.required],
      vendorId:['',Validators.required],
      stockQuantity: [null, Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadVendorProducts();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Failed to load categories:', error);
      }
    );
  }
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  loadVendorProducts(): void {
    const vendorId = localStorage.getItem('vendorId');
    if (vendorId) {
      this.productService.getProductsByVendorId(vendorId).subscribe(
        (products) => {
          this.products = products;
          this.initializeUpdateForms(products);
        },
        (error) => {
          console.error('Failed to load products:', error);
        }
      );
    }
  }

  initializeUpdateForms(products: Product[]): void {
    products.forEach(product => {
      this.updateForms[product.id] = this.fb.group({
        name: [product.name, Validators.required],
        description: [product.description, Validators.required],
        price: [product.price, Validators.required],
        categoryId: [product.categoryId, Validators.required],
        stockQuantity: [product.stockQuantity, Validators.required],
        imageUrl: [product.imageUrl, Validators.required],
      });
    });
  }

  toggleUpdateForm(productId: string): void {
    if (this.activeUpdateForm === productId) {
      this.activeUpdateForm = null; // Hide the form if it's already active
    } else {
      this.activeUpdateForm = productId; // Show the form for the selected product
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productForm.get('vendorId')?.enable();
      const newProduct: Product = this.productForm.value;
      this.productService.createProduct(newProduct).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          alert('Product created successfully.');
          this.productForm.reset();
          this.loadVendorProducts(); // Refresh the product list after creation
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product. Please try again.');
        }
      });
    }
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value;
    this.productForm.patchValue({ categoryId: categoryId });
  }

  onUpdateProduct(productId: string) {
    if (this.updateForms[productId]?.valid) {
      const vendorId = localStorage.getItem('vendorId'); // Fetch vendorId from localStorage
      if (!vendorId) {
        alert('Vendor ID is missing. Please log in again.');
        return;
      }
  
      const updatedProduct = {
        ...this.updateForms[productId].value,
        vendorId: vendorId // Ensure the vendorId is included in the payload
      };
  
      this.productService.updateProduct(productId, updatedProduct).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          alert('Product updated successfully.');
          this.loadVendorProducts(); // Refresh the product list after update
          this.activeUpdateForm = null; // Hide the form after updating
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product. Please try again.');
        }
      });
    }
  }
  
  deleteProductbyId(productId: string): void {
    const confirmation = confirm('Do you really want to delete this product?');
    if (confirmation) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Product deleted successfully.');
          alert('Product deleted successfully.');
          this.loadVendorProducts(); // Refresh the product list after deletion
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
  viewReviews() {
    this.currentAction = 'reviews';
  }

  fetchReviews(productId: string): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.selectedProductName = product.name;
      this.productService.getReviewsByProductId(productId).subscribe(
        (reviews) => {
          this.selectedProductReviews = reviews;
        },
        (error) => {
          console.error('Failed to load reviews:', error);
          alert('Failed to load reviews. Please try again.');
        }
      );
    }
  }


  createProduct() {
    this.currentAction = 'create';
  }

  viewProducts() {
    this.currentAction = 'products';
  }
  deleteProduct(){
    this.currentAction='delete';
  }

  signOut() {
    this.vendorService.signOut();
  }
}
