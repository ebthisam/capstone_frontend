import { Component, OnInit, HostListener, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { routes } from '../app.routes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, RouterOutlet, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lastScrolledPos: number = 0;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.addEventListeners();
      this.scrollReveal(); // Initial call
    }
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
}
