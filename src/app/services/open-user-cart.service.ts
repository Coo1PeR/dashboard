import {inject, Injectable} from '@angular/core';
import {Store} from "@ngxs/store";
import {UserFull} from "../interfaces/interfaces";
import {Router} from "@angular/router";
import {UserCartPageComponent} from "../components/user-cart-page/user-cart-page.component";

@Injectable({
  providedIn: 'root'
})
export class OpenUserCartService {
  private store = inject(Store)
  private router = inject(Router);

  openUserCartPage(user: UserFull) {
    this.router.navigate(['/user_cart', user.id]);
  }
}
