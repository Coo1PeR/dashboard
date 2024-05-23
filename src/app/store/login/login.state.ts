import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import { LoginAction } from './login.actions';

export class SetLoginData {
  static readonly type = '[Login] Set';
  constructor(public payload: { login: string, password: string }) {}
}

export interface LoginStateModel {
  login: string;
  password: string;
}

@State<LoginStateModel>({
  name: 'login',
  defaults: {
    login: '',
    password: ''
  }})

@Injectable()

export class LoginState {
  @Selector()
  static getLogin(state: LoginStateModel) {
    return state.login;
  }

  @Selector()
  static getPassword(state: LoginStateModel) {
    return state.password;
  }

  @Action(SetLoginData)
  setLoginData(ctx: StateContext<LoginStateModel>, action: SetLoginData) {
    ctx.setState({
      login: action.payload.login,
      password: action.payload.password
    });
  }
}
