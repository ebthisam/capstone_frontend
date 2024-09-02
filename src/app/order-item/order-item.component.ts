import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';

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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadOrderItems();
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadOrderItems(): void {
    const loadedItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.orderItems = loadedItems.map((item: { productImage: string; }) => ({
      ...item,
      safeUrl: this.getSafeUrl(item.productImage)
    }));
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increaseQuantity(index: number): void {
    this.orderItems[index].quantity++;
    this.updateCart();
  }

  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity--;
    } else {
      this.orderItems.splice(index, 1);
    }
    this.updateCart();
  }

  updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.orderItems));
    this.calculateTotalAmount();
  }

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
        localStorage.removeItem('cart');
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error('Error placing order:', err);
        alert('An error occurred. Please try again.');
      }
    });
  }
}
