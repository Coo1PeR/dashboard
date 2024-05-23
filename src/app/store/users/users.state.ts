import {Injectable} from '@angular/core';
import {State, Action, StateContext} from '@ngxs/store';
import {UsersAction} from './users.actions';
import {User, UserFull, Cart, Product, ProductList, Purchases} from "../../interfaces/interfaces";

export interface UsersStateModel {
  users: User[];
  userFull: UserFull[];
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    userFull: [],
  }
})

@Injectable()

export class UsersState {}
