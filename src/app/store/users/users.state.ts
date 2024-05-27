import {inject, Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {UsersAction} from './users.actions';
import {User, UserFull} from "../../interfaces/interfaces";
import {GetDataService} from "../../services/get-data.service";
import {pipe, tap} from "rxjs";
import {HttpClient, HttpClientModule} from "@angular/common/http";

export interface UsersStateModel {
  users: UserFull[];
  //userFull: UserFull[];
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    //userFull: [],
  }
})

@Injectable()

export class UsersState {
  private getDataService = inject(GetDataService)
  //static userFull: UserFull;


  @Action(UsersAction.FetchUsers)
  fetchUsers(ctx: StateContext<UsersStateModel>) {
    return this.getDataService.getUsers().pipe(
      tap((users: UserFull[]) => {
        ctx.patchState({ users: users });
      })
    );
  }

  @Action(UsersAction.UpdateUserDetails)
  updateUserDetails({ getState, patchState }: StateContext<UsersStateModel>, { payload }: UsersAction.UpdateUserDetails) {
    const state = getState();
    const users = state.users.map(user => {
      if (user.id === payload.id) {
        return {
          ...user,
          totalPurchase: payload.totalPurchase,
          userFullName: payload.userFullName
        };
      }
      return user;
    });

    patchState({
      users
    });
  }

  @Selector()
  static getUserFull(state: UsersStateModel) {
    return state.users;
  }
}
