import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {Cart, Product, UserFull} from '../interfaces/interfaces';
import {Store} from '@ngxs/store';
import {ProductsState} from '../core/stores/products/products.state';
import {CartsState} from '../core/stores/carts/carts.state';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private http = inject(HttpClient);
  // TODO remove
  private store = inject(Store);

  // TODO extract to environments (check angular cli environments)
  url: string = 'https://fakestoreapi.com';

  getUsers(): Observable<UserFull[]> {
    return this.http.get<UserFull[]>(`${this.url}/users`).pipe(map((users) => {
      return users.map((user) => {
        const userFullName = `${user.name.lastname.charAt(0).toUpperCase()}${user.name.lastname.slice(1)} ${user.name.firstname.charAt(0).toUpperCase()}${user.name.firstname.slice(1)}`;
        return {...user, userFullName}
      })
    }));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products`);
  }

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.url}/carts`);
  }

  // TODO extract, because not API
  // TODO any :)
  getUserCarts(userId: number): Observable<any> {
    return combineLatest([
      this.store.select(CartsState.getCartsFull),
      this.store.select(ProductsState.getProductsFull)
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

  // TODO extract, because not API
  totalPurchase(): Observable<UserFull[]> {
    return combineLatest([this.getUsers(), this.getCarts(), this.getProducts()]).pipe(
      map(([users, carts, products]) => this.processUserData(users, carts, products))
    );
  }

  private processUserData(users: UserFull[], carts: Cart[], products: Product[]): UserFull[] {
    // TODO can create "map" for products (new Map or object)
    return users.map(user => {
      const userCarts = carts.filter(cart => cart.userId === user.id);
      const totalPurchase = userCarts.reduce((total, cart) => {
        return total + cart.products.reduce((cartTotal, cartProduct) => {
          // TODO p :)
          const product = products.find(p => p.id === cartProduct.productId);
          return cartTotal + (product ? product.price * cartProduct.quantity : 0);
        }, 0);
      }, 0);

      return {...user, totalPurchase};
    });
  }
}
