import {UserFull} from "../../../interfaces/interface.user";

export namespace UsersAction {
  export class Fetch {
    static readonly type = '[Users] Fetch Users';
  }

  export class UpdateTotalPurchase {
    static readonly type = '[User] Update Total Purchase';
    constructor(public userId: number, public totalPurchase: number) {}
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
