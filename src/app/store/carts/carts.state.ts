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

  @Action(CartsAction.IncreaseProductQuantity)
  increaseProductQuantity(ctx: StateContext<CartsStateModel>, action: CartsAction.IncreaseProductQuantity) {
    const state = ctx.getState();
    const updatedCarts = state.carts.map(cart => {
      if (cart.userId === action.userId) {
        return {
          ...cart,
          products: cart.products.map(product => {
            if (product.productId === action.productId) {
              return { ...product, quantity: product.quantity + 1 };
            }
            return product;
          })
        };
      }
      return cart;
    });
    ctx.patchState({ carts: updatedCarts });
  }

  @Action(CartsAction.DecreaseProductQuantity)
  decreaseProductQuantity(ctx: StateContext<CartsStateModel>, action: CartsAction.DecreaseProductQuantity) {
    const state = ctx.getState();
    const updatedCarts = state.carts.map(cart => {
      if (cart.userId === action.userId) {
        return {
          ...cart,
          products: cart.products.map(product => {
            if (product.productId === action.productId && product.quantity > 1) {
              return { ...product, quantity: product.quantity - 1 };
            }
            return product;
          })
        };
      }
      return cart;
    });
    ctx.patchState({ carts: updatedCarts });
  }

  @Selector()
  static getCartsFull(state: CartsStateModel) {
    return state.carts;
  }
}
