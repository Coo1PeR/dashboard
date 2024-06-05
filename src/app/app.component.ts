import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatButton} from "@angular/material/button";
import {UsersAction} from "./core/stores/users/users.actions";
import {CartsAction} from "./core/stores/carts/carts.actions";
import {ProductsAction} from "./core/stores/products/products.actions";
import {Store} from "@ngxs/store";
import {ThemeService} from "./core/services/theme.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButton,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'dashboard';
  private router = inject(Router)
  private store = inject(Store)
  themeService: ThemeService = inject(ThemeService);


  ngOnInit() {
    this.store.dispatch(new UsersAction.Fetch());
    this.store.dispatch(new CartsAction.Fetch());
    this.store.dispatch(new ProductsAction.Fetch())
  }


  logout() {
    this.router.navigate(['/login']);
  }
}
