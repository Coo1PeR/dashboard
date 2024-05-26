export class CartsAction {
  static readonly type = '[Carts] Add item';
  constructor(public payload: string) { }
}

export namespace CartsAction {
  export class FetchCarts {
    static readonly type = '[Carts] Fetch Carts';
  }

  export class IncreaseProductQuantity {
    static readonly type = '[Cart] Increase Product Quantity';
    constructor(public userId: number, public productId: number) {}
  }

  export class DecreaseProductQuantity {
    static readonly type = '[Cart] Decrease Product Quantity';
    constructor(public userId: number, public productId: number) {}
  }
}


