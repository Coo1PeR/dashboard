import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {UsersAction} from "../../../store/users/users.actions";
import {Select, Store} from "@ngxs/store";
import {UsersState} from "../../../store/users/users.state";
import {Observable, tap} from "rxjs";
import {Cart, Product, UserFull} from "../../../interfaces/interfaces";
import {AsyncPipe, NgForOf} from "@angular/common";
import {ProductsAction} from "../../../store/products/products.actions";
import {ProductsState} from "../../../store/products/products.state";
import {CartsAction} from "../../../store/carts/carts.actions";
import {CartsState} from "../../../store/carts/carts.state";

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe, NgForOf],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private store = inject(Store)

  @Select(UsersState.getUserFull) users$!: Observable<UserFull[]>
  @Select(ProductsState.getProductsFull) products$!: Observable<Product[]>
  @Select(CartsState.getCartsFull) carts$!: Observable<Cart[]>



  ngOnInit() {
    this.store.dispatch(new UsersAction.FetchUsers()).subscribe(() => {
      this.users$.subscribe(users => {
        console.log('Users:', users)
      })
    });

    this.store.dispatch(new ProductsAction.FetchProducts()).subscribe(() => {
      this.products$.subscribe(products => {
        console.log('Products:', products)
      })
    })

    this.store.dispatch(new CartsAction.FetchCarts()).subscribe(() => {
      this.carts$.subscribe(carts => {
        console.log('Carts:', carts)
      })
    })
  }


  ngAfterViewInit() {
    console.log(1)
  }
}
