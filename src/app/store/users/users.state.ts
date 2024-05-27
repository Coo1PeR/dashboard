import {inject, Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {UsersAction} from './users.actions';
import {User, UserFull} from "../../interfaces/interfaces";
import {GetDataService} from "../../services/get-data.service";
import {pipe, tap} from "rxjs";
import {HttpClient, HttpClientModule} from "@angular/common/http";

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

  @Action(UsersAction.Fetch)
  fetchUsers(ctx: StateContext<UsersStateModel>) {
    return this.getDataService.getUsers().pipe(
      tap((users: UserFull[]) => {
        ctx.patchState({ users: users });
      })
    );
  }

  @Action(UsersAction.UpdateTotalPurchase)
  updateTotalPurchase(ctx: StateContext<UsersStateModel>, { users }: UsersAction.UpdateTotalPurchase) {
    ctx.patchState({ users });
  }

  @Selector()
  static getUserFull(state: UsersStateModel) {
    return state.users;
  }

  @Selector()
  static hasUsers(state: UsersStateModel) {
    return state.users.length > 0;
  }
}
