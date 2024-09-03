import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { ProductService } from '../product.service';



@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
  orderItems: any[] = [];
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    private productService:ProductService
  ) {}

  ngOnInit(): void {
    this.loadOrderItems();
  }

  // Sanitize URLs to prevent XSS
  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // Load order items from local storage
  loadOrderItems(): void {
    let loadedItems = JSON.parse(localStorage.getItem('cart') || '[]');
    loadedItems.forEach((item: any) => {
      this.productService.getProductById(item.productId).subscribe(product => {
        this.orderItems.push({
          ...item,
          productName: product.name,
          price: product.price,
          productImage: product.imageUrl,
          safeUrl: this.getSafeUrl(product.imageUrl)
        });
        this.calculateTotalAmount();
      });
    });
  }

  // Calculate total amount for the order
  calculateTotalAmount(): void {
    this.totalAmount = this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Increase the quantity of an item in the cart
  increaseQuantity(index: number): void {
    this.orderItems[index].quantity++;
    this.updateCart();
  }

  // Decrease the quantity of an item in the cart
  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity--;
    } else {
      this.orderItems.splice(index, 1);
    }
    this.updateCart();
  }

  // Update the cart in local storage
  updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.orderItems));
    this.calculateTotalAmount();
  }

  // Handle adding a product to the cart
  addToCart(product: any): void {
    console.log('Product:', product); // Debugging: Check product details
    if (!product || !product.id) {
      console.error('Product is undefined or missing id.');
      return;
    }
    // Add the product to the cart logic (to be implemented)
  }

  // Place the order and handle API call
  placeOrder(): void {
    const orderData = {
      userId: localStorage.getItem('userId') || 'defaultUserId',
      orderDate: new Date(),
      totalAmount: this.totalAmount,
      orderItems: this.orderItems
    };
    
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        console.log('Order placed successfully');
        alert("Order placed successfully");
        localStorage.removeItem('cart');
        this.router.navigate(['/home']);  // Adjust according to the desired destination
      },
      error: err => {
        alert('An error occurred. Please try again.');
      }
    });
  }
}
