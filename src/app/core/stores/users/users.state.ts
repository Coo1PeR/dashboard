import {inject, Injectable} from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UsersAction } from './users.actions';
import { UserFull } from "../../../interfaces/interface.user";
import { GetDataService } from "../../../services/get-data.service";
import { tap } from "rxjs/operators";
import { patch, updateItem, append } from '@ngxs/store/operators';

export interface UsersStateModel {
  users: UserFull[];
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
  }
})

@Injectable()
export class UsersState {
  private getDataService = inject(GetDataService)

  @Selector()
  static Users(state: UsersStateModel) {
    return state.users;
  }

  @Selector()
  static hasUsers(state: UsersStateModel) {
    return state.users.length > 0;
  }

  @Action(UsersAction.Fetch)
  fetchUsers(ctx: StateContext<UsersStateModel>) {
    return this.getDataService.getUsers().pipe(
      tap((users: UserFull[]) => {
        ctx.patchState({ users });
      })
    );
  }

  @Action(UsersAction.UpdateTotalPurchase)
  updateTotalPurchase(ctx: StateContext<UsersStateModel>, { userId, totalPurchase }: UsersAction.UpdateTotalPurchase) {
    ctx.setState(
      patch({
        users: updateItem<UserFull>(user => user.id === userId, patch({ totalPurchase }))
      })
    );
  }

  @Action(UsersAction.Update)
  updateUser(ctx: StateContext<UsersStateModel>, { user }: UsersAction.Update) {
    ctx.setState(
      patch({
        users: updateItem<UserFull>(u => u.id === user.id, user)
      })
    );
  }

  @Action(UsersAction.AddUser)
  addUser(ctx: StateContext<UsersStateModel>, { user }: UsersAction.AddUser) {
    ctx.setState(
      patch({
        users: append([user])
      })
    );
  }
}
