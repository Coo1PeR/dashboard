import {inject, Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {CartsAction} from './carts.actions';
import {Cart, ProductList} from "../../interfaces/interfaces";
import {GetDataService} from "../../services/get-data.service";
import {tap} from "rxjs";

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

export class CartsState {
  private getDataService = inject(GetDataService)

  @Action(CartsAction.FetchCarts)
  fetchCarts(ctx: StateContext<CartsStateModel>) {
    return this.getDataService.getCarts().pipe(
      tap((carts: Cart[]) => {
        ctx.patchState({ carts: carts });
      })
    );
  }

  @Selector()
  static getCartsFull(state: CartsStateModel) {
    return state.carts;
  }
}
