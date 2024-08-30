import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route redirects to HomeComponent
  { path: '', component: HomeComponent }, 
  { path: 'products/:categoryId', component: ProductListComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', redirectTo: '404NotFoundException' },                   // Wildcard route redirects to HomeComponent
];

@NgModule({
  imports: [    RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
],
  exports: [RouterModule]
})
export class AppRoutingModule {}
