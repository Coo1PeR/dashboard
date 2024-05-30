import {Component, inject, Input, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {CurrencyPipe} from "@angular/common";
import {CartsAction} from "../../../core/stores/carts/carts.actions";
import {Store} from "@ngxs/store";
import {MatIcon} from "@angular/material/icon";
import {MatCardContent} from "@angular/material/card";
import {combineLatest, Observable} from "rxjs";
import {CartsState} from "../../../core/stores/carts/carts.state";
import {ProductsState} from "../../../core/stores/products/products.state";
import {map} from "rxjs/operators";
import {Cart} from "../../../interfaces/interface.cart";
import {ProductCart} from "../../../interfaces/interface.product";

@Component({
  selector: 'app-shopping-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButton,
    CurrencyPipe,
    MatIcon,
    MatCardContent,
  ],
  templateUrl: './shopping-table.component.html',
  styleUrl: './shopping-table.component.scss'
})

export class ShoppingTableComponent implements OnInit {
  @Input() userId!: number;
  carts: Cart[] = [];
  displayedColumns: string[] = ['title', 'price', 'quantity', 'sum'];
  private store = inject(Store);
  carts$: Observable<Cart[]> = this.getUserCarts(this.userId);

  ngOnInit() {
    this.loadCarts();
  }

  loadCarts() {
    this.getUserCarts(this.userId).subscribe(carts => {
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

  getUserCarts(userId: number): Observable<any> {
    return combineLatest([
      this.store.select(CartsState.Carts),
      this.store.select(ProductsState.Products)
    ]).pipe(
      map(([carts, products]) => {
        const userCarts = carts.filter(cart => cart.userId === userId);
        return userCarts.map(cart => {
          return {
            id: cart.id,
            products: cart.products.map(cartProduct => {
              const product = products.find(p => p.id === cartProduct.productId);
              return {
                productId: cartProduct.productId,
                title: product?.title || 'Unknown Product',
                price: product?.price || 0,
                quantity: cartProduct.quantity,
                sum: (product?.price || 0) * cartProduct.quantity
              };
            })
          };
        });
      })
    );
  }
}

