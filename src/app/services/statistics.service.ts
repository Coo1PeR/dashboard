import { inject, Injectable } from '@angular/core';
import { Observable, combineLatest } from "rxjs";
import { UsersState } from "../core/stores/users/users.state";
import { map } from "rxjs/operators";
import { Cart, Product, UserFull } from '../interfaces/interfaces';
import { CartsState } from "../core/stores/carts/carts.state";
import {Select, Store} from "@ngxs/store";
import {ProductsState} from "../core/stores/products/products.state";

// TODO move to core/services
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  @Select(CartsState.getCartsFull) carts$!: Observable<Cart[]>;
  @Select(ProductsState.getProductsFull) products$!: Observable<Product[]>;

  private store = inject(Store);

  // Метод для вычисления соотношения купленных всех видов товаров и их количества
  // TODO extract interface
  calculateProductRatio(): Observable<{ productTitle: string, productTotalPurchase: number }[]> {
    return combineLatest([
      this.carts$,
      this.products$
    ]).pipe(
      map(([carts, products]) => {
        // TODO refactor whole map callback
        const productMap = new Map<number, number>();

        carts.forEach(cart => {
          cart.products.forEach(product => {
            const productId = product.productId;
            const currentTotal = productMap.get(productId) || 0;
            productMap.set(productId, currentTotal + product.quantity);
          });
        });

        return Array.from(productMap.entries()).map(([productId, productTotalPurchase]) => {
          const product = products.find(p => p.id === productId);
          return {
            productTitle: product ? product.title : 'Unknown Product',
            productTotalPurchase: productTotalPurchase
          };
        });
      })
    );
  }

  // Метод для подсчета общей суммы покупок пользователей
  calculateTotalPurchase(): Observable<{ userFullName: string, userTotalPurchaseSum: number }[]> {
    // TODO check takeUntilDestroyed
    // TODO check stores.selectSnapshot
    return this.store.select(UsersState.getUserFull).pipe(
      map((users: UserFull[]) => {
        return users.map(user => ({
          userFullName: user.userFullName,
          userTotalPurchaseSum: user.totalPurchase
        }));
      })
    );
  }
}
