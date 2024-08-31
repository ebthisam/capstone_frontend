import { Component, OnInit, HostListener, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, RouterOutlet, RouterModule,CommonModule,RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lastScrolledPos: number = 0;
  isBrowser: boolean;
  categories: Category[] = [];
  showCategoriesDropdown = false;
  products: Product[]=[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private productService: ProductService,private categoryService: CategoryService,private router: Router,private userService:UserService ,private route:ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleCategoriesDropdown(show: boolean): void {
    this.showCategoriesDropdown = show;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    if (this.isBrowser) {
      this.addEventListeners();
      this.scrollReveal(); // Initial call
    }
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  onCategorySelect(event: Event) {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    console.log('Selected Category ID:', selectedCategoryId);
    // You can add additional logic here based on the selected category
  }
  

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
     
    );
  }



  addEventListeners(): void {
    const navTogglers = document.querySelectorAll("[data-nav-toggler]");
    const navbar = document.querySelector("[data-navbar]");
    const navbarLinks = document.querySelectorAll("[data-nav-link]");
    const overlay = document.querySelector("[data-overlay]");

    if (navbar && overlay) {
      this.addEventOnElem(navTogglers, 'click', () => this.toggleNavbar(navbar, overlay));
      this.addEventOnElem(navbarLinks, 'click', () => this.closeNavbar(navbar, overlay));
    }
  }

  
  addEventOnElem(elem: NodeListOf<Element>, type: string, callback: EventListener): void {
    elem.forEach(element => {
      element.addEventListener(type, callback);
    });
  }

  toggleNavbar(navbar: Element, overlay: Element): void {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  closeNavbar(navbar: Element, overlay: Element): void {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      this.headerActive();
      this.headerSticky();
      this.scrollReveal();
    }
  }

  headerActive(): void {
    const header = document.querySelector("[data-header]");
    const backTopBtn = document.querySelector("[data-back-top-btn]");
    if (header && backTopBtn) {
      if (window.scrollY > 150) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
      } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
      }
    }
  }

  headerSticky(): void {
    const header = document.querySelector("[data-header]");
    if (header) {
      if (this.lastScrolledPos >= window.scrollY) {
        header.classList.remove("header-hide");
      } else {
        header.classList.add("header-hide");
      }
    }
    this.lastScrolledPos = window.scrollY;
  }
  

  scrollReveal(): void {
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight / 2) {
        section.classList.add("active");
      }
    });
  }


  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Failed to load products:', error);
      }
    );
  }
  signOut(){
    this.userService.signOut();


  }
 
}
