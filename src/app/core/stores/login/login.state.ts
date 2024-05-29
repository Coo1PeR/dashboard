import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';

export class SetLoginData {
  static readonly type = '[Login] Set';

  constructor(public payload: { login: string, password: string }) {
  }
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
  }
})

@Injectable()

export class LoginState {
  @Selector()
  static Login(state: LoginStateModel) {
    return state.login;
  }

  @Selector()
  static Password(state: LoginStateModel) {
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
