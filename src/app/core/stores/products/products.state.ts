import {inject, Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {ProductsAction} from './products.actions';
import {Product, UserFull} from "../../../interfaces/interfaces";
import {UsersAction} from "../users/users.actions";
import {tap} from "rxjs";
import {UsersStateModel} from "../users/users.state";
import {GetDataService} from "../../../services/get-data.service";

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

export class ProductsState {
  private getDataService = inject(GetDataService)

  @Action(ProductsAction.Fetch)
  fetchProducts(ctx: StateContext<ProductsStateModel>) {
    return this.getDataService.getProducts().pipe(
      tap((products: Product[]) => {
        ctx.patchState({ products: products });
      })
    );
  }

  // TODO move to top
  @Selector()
  static getProductsFull(state: ProductsStateModel) {
    return state.products;
  }
}
