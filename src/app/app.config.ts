import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NgxsModule} from "@ngxs/store";
import {UsersState} from "./core/stores/users/users.state";
import {CartsState} from "./core/stores/carts/carts.state";
import {ProductsState} from "./core/stores/products/products.state";
import {LoginState} from "./core/stores/login/login.state";
import {provideHttpClient} from "@angular/common/http";
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom([
      NgxsModule.forRoot([UsersState, CartsState, ProductsState, LoginState], {developmentMode: environment.production}),
      NgxsLoggerPluginModule.forRoot({disabled: environment.production}),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production })
    ]),
    provideHttpClient()
  ],

};
