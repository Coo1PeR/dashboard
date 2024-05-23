import {Injectable} from '@angular/core';
import {State, Action, StateContext} from '@ngxs/store';
import {CartsAction} from './carts.actions';
import {Cart, ProductList} from "../../interfaces/interfaces";

export interface CartsStateModel {
  carts: Cart[];
  productList: ProductList[];
}

@State<CartsStateModel>({
  name: 'carts',
  defaults: {
    carts: [],
    productList: [],
  }
})

@Injectable()

export class CartsState {}
