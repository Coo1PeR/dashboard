export class UsersAction {
  static readonly type = '[Users] Add item';
  constructor(public payload: string) { }
}

export namespace UsersAction {
  export class FetchUsers {
    static readonly type = '[Users] Fetch Users';
  }

  export class UpdateUserDetails {
    static readonly type = '[User] Update Details';
    constructor(public payload: { id: number; totalPurchase: number; userFullName: string }) {}
  }
}



