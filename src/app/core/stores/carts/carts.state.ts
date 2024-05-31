import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CartsAction } from './carts.actions';
import { GetDataService } from "../../services/get-data.service";
import { tap } from "rxjs/operators";
import { Cart, ProductList } from "../../interfaces/interface.cart";
import {patch, updateItem} from '@ngxs/store/operators';

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
  constructor(private getDataService: GetDataService) {}

  @Action(CartsAction.Fetch)
  fetchCarts(ctx: StateContext<CartsStateModel>) {
    return this.getDataService.getCarts().pipe(
      tap((carts: Cart[]) => {
        ctx.patchState({ carts });
      })
    );
  }

  @Selector()
  static Carts({ carts }: CartsStateModel) {
    return carts;
  }

  @Action(CartsAction.SetQuantity)
  setProductQuantity(ctx: StateContext<CartsStateModel>, action: CartsAction.SetQuantity) {
    const { cartId, userId, productId, quantity } = action;

    ctx.setState(
      patch({
        carts: updateItem<Cart>(
          cart => cart.id === cartId && cart.userId === userId,
          patch({
            products: updateItem<ProductList>(
              product => product.productId === productId,
              patch({ quantity })
            )
          })
        )
      })
    );
  }
}
