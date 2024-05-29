import {Component, inject, Input, OnInit} from '@angular/core';
import {GetDataService} from "../../../services/get-data.service";
import {MatTableModule} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {CartsAction} from "../../../core/stores/carts/carts.actions";
import {Store} from "@ngxs/store";
import {MatIcon} from "@angular/material/icon";
import {MatCardContent} from "@angular/material/card";
import {Cart, Product, ProductCart} from "../../../interfaces/interfaces";

@Component({
  selector: 'app-shopping-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButton,
    CurrencyPipe,
    MatIcon,
    NgForOf,
    MatCardContent,
    NgIf
  ],
  templateUrl: './shopping-table.component.html',
  styleUrl: './shopping-table.component.scss'
})

export class ShoppingTableComponent implements OnInit {
  @Input() userId!: number;
  carts: Cart[] = [];
  displayedColumns: string[] = ['title', 'price', 'quantity', 'sum'];
  private store = inject(Store);

  private getDataService = inject(GetDataService);

  ngOnInit() {
    this.loadCarts();
  }

  loadCarts() {
    this.getDataService.getUserCarts(this.userId).subscribe(carts => {
      this.carts = carts;
    });
  }

  increaseQuantity(cartId: number, product:  ProductCart) {
    console.log(product)
    const newQuantity = product.quantity + 1;
    this.store.dispatch(new CartsAction.SetQuantity(this.userId, cartId, product.productId, newQuantity));
    product.quantity = newQuantity;
    product.sum = product.price * newQuantity;
  }

  decreaseQuantity(cartId: number, product: ProductCart) {
    if (product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      this.store.dispatch(new CartsAction.SetQuantity(this.userId, cartId, product.productId, newQuantity));
      product.quantity = newQuantity;
      product.sum = product.price * newQuantity;
    }
  }
}

