import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      const expectedRole = route.data['expectedRole'];
      if (role === expectedRole) {
        return true;
      } else {
        // Redirect to an appropriate page if the role doesn't match
        this.router.navigate(['/login']); // or redirect to a specific page
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
