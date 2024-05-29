import {inject, Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ProductsAction} from './products.actions';
import {Product} from "../../../interfaces/interfaces";
import {tap} from "rxjs";
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

  @Selector()
  static Products(state: ProductsStateModel) {
    return state.products;
  }

  @Action(ProductsAction.Fetch)
  fetchProducts(ctx: StateContext<ProductsStateModel>) {
    return this.getDataService.getProducts().pipe(
      tap((products: Product[]) => {
        ctx.patchState({products: products});
      })
    );
  }
}
