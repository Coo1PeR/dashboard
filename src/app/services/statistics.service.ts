import { inject, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { UsersState } from "../store/users/users.state";
import { map, switchMap } from "rxjs/operators";
import { Cart, Product, UserFull } from '../interfaces/interfaces';
import { CartsState } from "../store/carts/carts.state";
import { Store } from "@ngxs/store";
import { GetDataService } from "./get-data.service";
import {ProductsState} from "../store/products/products.state";

// TODO move to core/services
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private router = inject(Router);
  private store = inject(Store);
  private getDataService = inject(GetDataService);

  // Метод для вычисления соотношения купленных всех видов товаров и их количества
  // TODO extract interface
  calculateProductRatio(): Observable<{ productTitle: string, productTotalPurchase: number }[]> {
    return combineLatest([
      // TODO refactor to @Select
      this.store.select(CartsState.getCartsFull),
      this.store.select(ProductsState.getProductsFull)
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
    // TODO check store.selectSnapshot
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
