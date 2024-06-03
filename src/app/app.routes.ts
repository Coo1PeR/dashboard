import {Routes} from '@angular/router';
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {MainPageComponent} from "./components/main-page/main-page.component";
import {UserCartPageComponent} from "./components/user-cart-page/user-cart-page.component";
import {UsersTableComponent} from "./components/main-page/users-table/users-table.component";
import {StatisticsComponent} from "./components/main-page/statistics/statistics.component";

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
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'},
      {
        path: 'users',
        component: UsersTableComponent,
        title: 'Users Table',
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        title: 'Statistics Table',
      }
    ]
  },

  // TODO try split tab to routing
  {
    path: 'user-id/:id',
    component: UserCartPageComponent,
    title: 'User Cart',
  }
];
