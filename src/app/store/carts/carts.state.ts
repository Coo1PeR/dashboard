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

  @Action(CartsAction.SetProductQuantity)
  setProductQuantity(ctx: StateContext<CartsStateModel>, action: CartsAction.SetProductQuantity) {
    const state = ctx.getState();
    const updatedCarts = state.carts.map(cart => {
      if (cart.id === action.cartId && cart.userId === action.userId) {
        return {
          ...cart,
          products: cart.products.map(product => {
            if (product.productId === action.productId) {
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
