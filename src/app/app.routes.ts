import { Routes } from '@angular/router';
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {MainPageComponent} from "./components/main-page/main-page.component";
import {UserCartPageComponent} from "./components/user-cart-page/user-cart-page.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login Page',
  },
  {
    path: 'main',
    component: MainPageComponent,
    title: 'Main Page',
  },
  // TODO try split tab to routing
  {
    path: 'user-id/:id',
    component: UserCartPageComponent,
    title: 'User Cart',
  }
];
