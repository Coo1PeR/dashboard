export class ProductsAction {
  static readonly type = '[Products] Add item';
  constructor(public payload: string) { }
}

export namespace ProductsAction {
  export class FetchProducts {
    static readonly type = '[Products] Fetch Products';
  }
}
