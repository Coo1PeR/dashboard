export namespace CartsAction {
  export class Fetch {
    static readonly type = '[Carts] Fetch Carts';
  }

  export class SetQuantity {
    static readonly type = '[Cart] Set Product Quantity';
    constructor(public userId: number, public cartId: number, public productId: number, public quantity: number) {}
  }
}


