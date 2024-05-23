export class UsersAction {
  static readonly type = '[Users] Add item';
  constructor(public payload: string) { }
}

export namespace UsersAction {
  export class FetchUsers {
    static readonly type = '[Users] Fetch Users';
  }
}

