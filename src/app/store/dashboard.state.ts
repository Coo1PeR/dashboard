import {Injectable} from '@angular/core';
import {State, Action, StateContext} from '@ngxs/store';
import {DashboardAction} from './dashboard.actions';
import {User, UserFull, Cart, Product, ProductList, Purchases} from "../interfaces/interfaces";

export interface DashboardStateModel {
  users: User[];
  carts: Cart[];
  products: Product[];
  userFull: UserFull[];
}

@State<DashboardStateModel>({
  name: 'dashboard',
  defaults: {
    users: [],
    carts: [],
    products: [],
    userFull: [],
  }
})

@Injectable()

export class DashboardState {}
