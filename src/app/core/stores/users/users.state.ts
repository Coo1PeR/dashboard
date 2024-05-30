import {inject, Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UsersAction} from './users.actions';
import {UserFull} from "../../../interfaces/interface.user";
import {GetDataService} from "../../../services/get-data.service";
import {tap} from "rxjs";

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
        ctx.patchState({users: users});
      })
    );
  }

  @Action(UsersAction.UpdateTotalPurchase)
  updateTotalPurchase(ctx: StateContext<UsersStateModel>, action: UsersAction.UpdateTotalPurchase) {
    const state = ctx.getState();
    const users = state.users.map(user => {
      if (user.id === action.userId) {
        return {...user, totalPurchase: action.totalPurchase};
      }
      return user;
    });
    ctx.setState({...state, users});
  }

  @Action(UsersAction.Update)
  updateUser(ctx: StateContext<UsersStateModel>, {user}: UsersAction.Update) {
    const state = ctx.getState();
    const updatedUsers = state.users.map(u => {
      if (u.id === user.id) {
        return user;
      } else {
        return u;
      }
    });
    // TODO check State Operators (ngxs docs)
    ctx.patchState({
      users: updatedUsers
    });
  }

  @Action(UsersAction.AddUser)
  addUser(ctx: StateContext<UsersStateModel>, { user }: UsersAction.AddUser) {
    const state = ctx.getState();
    ctx.patchState({
      users: [...state.users, user]
    });
  }
}
