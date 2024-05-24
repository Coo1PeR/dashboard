import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NgxsModule} from "@ngxs/store";
import {UsersState} from "./store/users/users.state";
import {CartsState} from "./store/carts/carts.state";
import {ProductsState} from "./store/products/products.state";
import {LoginState} from "./store/login/login.state";
import {provideHttpClient} from "@angular/common/http";
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      NgxsModule.forRoot([UsersState, CartsState, ProductsState, LoginState]),
      NgxsLoggerPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot()
    ]),
    provideHttpClient()
  ],

};
