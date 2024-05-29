import {inject, Injectable} from '@angular/core';
import {UserFull} from "../interfaces/interfaces.user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class OpenUserCartService {
  private router = inject(Router);

  openUserCartPage(user: UserFull) {
    this.router.navigate(['/user_cart', user.id]);
  }
}
