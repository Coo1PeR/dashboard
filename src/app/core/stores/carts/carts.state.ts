import {inject, Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {CartsAction} from './carts.actions';
import {GetDataService} from "../../../services/get-data.service";
import {tap} from "rxjs";
import {Cart, ProductList} from "../../../interfaces/interface.cart";

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

  @Action(CartsAction.Fetch)
  fetchCarts(ctx: StateContext<CartsStateModel>) {
    return this.getDataService.getCarts().pipe(
      tap((carts: Cart[]) => {
        ctx.patchState({ carts: carts });
      })
    );
  }

  @Selector()
  static Carts({ carts }: CartsStateModel) {
    return carts;
  }

  @Action(CartsAction.SetQuantity)
  setProductQuantity(ctx: StateContext<CartsStateModel>, action: CartsAction.SetQuantity) {
    const state = ctx.getState();
    // TODO check State Operators (ngxs docs)
    const updatedCarts = state.carts.map(cart => {
      if (cart.id === +action.cartId && cart.userId === +action.userId) {
        return {
          ...cart,
          products: cart.products.map(product => {
            if (product.productId === +action.productId) {
              return {
                ...product,
                quantity: action.quantity
              };
            }
            return product;
          })
        };
      }
      return cart;
    });

    ctx.setState({
      ...state,
      carts: updatedCarts
    });
  }

}
