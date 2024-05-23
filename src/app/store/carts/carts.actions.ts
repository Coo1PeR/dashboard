export class CartsAction {
  static readonly type = '[Carts] Add item';
  constructor(public payload: string) { }
}

export namespace CartsAction {
  export class FetchCarts {
    static readonly type = '[Carts] Fetch Carts';
  }
}
