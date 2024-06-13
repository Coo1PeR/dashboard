import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButton} from "@angular/material/button";
import {UsersAction} from "./core/stores/users/users.actions";
import {CartsAction} from "./core/stores/carts/carts.actions";
import {ProductsAction} from "./core/stores/products/products.actions";
import {Store} from "@ngxs/store";
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
  private store = inject(Store)

  ngOnInit() {
    this.store.dispatch(new UsersAction.Fetch());
    this.store.dispatch(new CartsAction.Fetch());
    this.store.dispatch(new ProductsAction.Fetch())
  }
}
