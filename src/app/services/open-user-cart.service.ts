import {inject, Injectable} from '@angular/core';
import {Store} from "@ngxs/store";
import {UserFull} from "../interfaces/interfaces";
import {Router} from "@angular/router";

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
