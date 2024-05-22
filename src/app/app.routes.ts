import { Routes } from '@angular/router';
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {MainPageComponent} from "./components/main-page/main-page.component";

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    title: 'Login Page',
  },
  {
    path: 'main',
    component: MainPageComponent,
    title: 'Main Page',
  },
];
