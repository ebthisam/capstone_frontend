export class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    vendorId: string;
    stockQuantity: number;
    imageUrl: string;
    reviewIds: string[] = [];
    averageRating?: number; // Add this if you're calculating average rating

  
    constructor(id: string, name: string, description: string, price: number, categoryId: string, vendorId: string, stockQuantity: number, imageUrl: string, reviewIds: string[] = []) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.categoryId = categoryId;
      this.vendorId = vendorId;
      this.stockQuantity = stockQuantity;
      this.imageUrl = imageUrl;
      this.reviewIds = reviewIds;
    }
  }
  