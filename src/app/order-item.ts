// src/app/models/order-item.ts

export class OrderItem {
    id!: string;
    orderId!: string;
    productId!: string;
    productName!: string;
    price!: number;
    quantity!: number;
    
  
    constructor(
      id: string,
      orderId: string,
      productId: string,
      productName: string,
      price: number,
      quantity: number
    ) {
      this.id = id;
      this.orderId = orderId;
      this.productId = productId;
      this.productName = productName;
      this.price = price;
      this.quantity = quantity;
    }
  }
  