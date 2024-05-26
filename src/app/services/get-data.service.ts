import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, tap, map, shareReplay } from 'rxjs/operators';
import { Cart, Product, UserFull } from '../interfaces/interfaces';
import { Store } from '@ngxs/store';
import { UsersAction } from '../store/users/users.actions';
import { ProductsAction } from '../store/products/products.actions';
import { CartsAction } from '../store/carts/carts.actions';
import { UsersState } from '../store/users/users.state';
import { ProductsState } from '../store/products/products.state';
import { CartsState } from '../store/carts/carts.state';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private usersLoaded = false;
  private users$ = new BehaviorSubject<UserFull[]>([]);

  url: string = 'https://fakestoreapi.com';

  getUsers(): Observable<UserFull[]> {
    return this.http.get<UserFull[]>(`${this.url}/users`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products`);
  }

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.url}/carts`);
  }

  fetchAllData(): Observable<UserFull[]> {
    if (this.usersLoaded) {
      return this.users$.asObservable();
    }

    return this.store.dispatch(new UsersAction.FetchUsers()).pipe(
      switchMap(() => this.store.dispatch(new CartsAction.FetchCarts())),
      switchMap(() => this.store.dispatch(new ProductsAction.FetchProducts())),
      switchMap(() => combineLatest([
        this.store.select(UsersState.getUserFull),
        this.store.select(CartsState.getCartsFull),
        this.store.select(ProductsState.getProductsFull)
      ]).pipe(
        map(([users, carts, products]) => {
          return users.map(user => {
            const userCarts = carts.filter(cart => cart.userId === user.id);
            const totalPurchase = userCarts.reduce((total, cart) => {
              return total + cart.products.reduce((cartTotal, cartProduct) => {
                const product = products.find(p => p.id === cartProduct.productId);
                return cartTotal + (product ? product.price * cartProduct.quantity : 0);
              }, 0);
            }, 0);
            return { ...user, totalPurchase, userFullName: `${user.name.lastname.charAt(0).toUpperCase()}${user.name.lastname.slice(1)} ${user.name.firstname.charAt(0).toUpperCase()}${user.name.firstname.slice(1)}` };
          });
        }),
        tap(usersWithTotalPurchase => {
          this.users$.next(usersWithTotalPurchase);
          this.usersLoaded = true;
        }),
        //shareReplay(1)
      ))
    );
  }

  getUserPurchases(userId: number): Observable<any[]> {
    return combineLatest([
      this.store.select(CartsState.getCartsFull),
      this.store.select(ProductsState.getProductsFull)
    ]).pipe(
      map(([carts, products]) => {
        const userCarts = carts.filter(cart => cart.userId === userId);
        return userCarts.flatMap(cart =>
          cart.products.map(cartProduct => {
            const product = products.find(p => p.id === cartProduct.productId);
            return {
              title: product?.title || 'Unknown Product',
              price: product?.price || 0,
              quantity: cartProduct.quantity,
              sum: (product?.price || 0) * cartProduct.quantity
            };
          })
        );
      })
    );
  }
}
