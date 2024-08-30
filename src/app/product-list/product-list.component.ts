import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { Product } from '../product';
import { Category } from '../category';
import { Router } from '@angular/router';





@Component({
  selector: 'app-product-list',
  standalone: true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule,RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];


  categoryName: string = '';

  constructor(private route: ActivatedRoute, private categoryService: CategoryService,   private router: Router,
    ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      this.loadProducts(categoryId);
    });
  
  }
  onCategorySelect(categoryId: string): void {
    this.router.navigate(['/products', categoryId]);
  }

  loadProducts(categoryId: string): void {
    this.categoryService.getProductsByCategoryId(categoryId).subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products:', err)
    });
  }
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }
}




  


