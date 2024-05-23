import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { UsersAction } from "../../../store/users/users.actions";
import { Select, Store } from "@ngxs/store";
import { UsersState } from "../../../store/users/users.state";
import { combineLatest, map, Observable, switchMap, shareReplay, tap } from "rxjs";
import { Cart, Product, UserFull } from "../../../interfaces/interfaces";
import {AsyncPipe, CommonModule, CurrencyPipe, NgForOf} from "@angular/common";
import { ProductsAction } from "../../../store/products/products.actions";
import { ProductsState } from "../../../store/products/products.state";
import { CartsAction } from "../../../store/carts/carts.actions";
import { CartsState } from "../../../store/carts/carts.state";
import { MatTableModule } from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe, NgForOf, MatTableModule, MatSortModule, MatProgressBarModule, CurrencyPipe, CommonModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private store = inject(Store);
  @ViewChild(MatSort) sort!: MatSort;


  @Select(UsersState.getUserFull) users$!: Observable<UserFull[]>;
  @Select(ProductsState.getProductsFull) products$!: Observable<Product[]>;
  @Select(CartsState.getCartsFull) carts$!: Observable<Cart[]>;

  usersWithTotalPurchase$!: Observable<UserFull[]>;
  dataSource = new MatTableDataSource<UserFull>();
  displayedColumns: string[] = ['userFullName', 'phone', 'totalPurchase'];
  isLoading = true;

  ngOnInit() {
    this.usersWithTotalPurchase$ = this.store.dispatch(new UsersAction.FetchUsers()).pipe(
      switchMap(() => this.store.dispatch(new ProductsAction.FetchProducts())),
      switchMap(() => this.store.dispatch(new CartsAction.FetchCarts())),
      switchMap(() => combineLatest([this.users$, this.carts$, this.products$]).pipe(
        map(([users, carts, products]) => {
          return users.map(user => {
            const userCarts = carts.filter(cart => cart.userId === user.id);
            const totalPurchase = userCarts.reduce((total, cart) => {
              return total + cart.products.reduce((cartTotal, cartProduct) => {
                const product = products.find(p => p.id === cartProduct.productId);
                return cartTotal + (product ? product.price * cartProduct.quantity : 0);
              }, 0);
            }, 0);
            return {...user, totalPurchase, userFullName: `${user.name.firstname} ${user.name.lastname}`};
          });
        }),
        shareReplay(1)  // Кэшируем последний эмитированный элемент
      )),
      tap(() => this.isLoading = false)
    );

    // Update dataSource when usersWithTotalPurchase$ emits new values
    this.usersWithTotalPurchase$.subscribe(users => {
      this.dataSource.data = users;
      console.log('Users with total purchases:', users);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
