import {Injectable} from '@angular/core';
import {State, Action, StateContext} from '@ngxs/store';
import {ProductsAction} from './products.actions';
import {Product} from "../../interfaces/interfaces";

export interface ProductsStateModel {
  products: Product[];
}

@State<ProductsStateModel>({
  name: 'products',
  defaults: {
    products: [],
  }
})

@Injectable()

export class ProductsState {}
