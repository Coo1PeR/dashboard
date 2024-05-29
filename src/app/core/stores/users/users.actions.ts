import {UserFull} from "../../../interfaces/interfaces";

// TODO rename Action and Actions Namespace
export class UsersAction {
  static readonly type = '[Users] Add item';
  constructor(public payload: string) { }
}

export namespace UsersAction {
  export class Fetch {
    static readonly type = '[Users] Fetch Users';
  }

  export class UpdateDetails {
    static readonly type = '[User] Update Details';
    constructor(public payload: { id: number; totalPurchase: number; userFullName: string }) {}
  }

  export class UpdateTotalPurchase {
    static readonly type = '[Users] Update Total Purchase';
    constructor(public users: UserFull[]) {}
  }

  export class AddUser {
    static readonly type = '[Users] Add User';
    constructor(public user: UserFull) {}
  }

  export class Update {
    static readonly type = '[Users] Update User';
    constructor(public user: UserFull) {}
  }
}



