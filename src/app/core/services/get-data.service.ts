import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserFull} from '../interfaces/interface.user';
import {Cart} from "../interfaces/interface.cart";
import {Product} from "../interfaces/interface.product";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private http = inject(HttpClient);

  url: string = environment.apiUrl;

  getUsers(): Observable<UserFull[]> {
    return this.http.get<UserFull[]>(`${this.url}/users`).pipe(
      map(users => users.map(user => this.mapUserFullName(user)))
    );
  }

  private mapUserFullName(user: UserFull): UserFull {
    const userFullName = `${user.name.lastname.charAt(0).toUpperCase()}${user.name.lastname.slice(1)} ${user.name.firstname.charAt(0).toUpperCase()}${user.name.firstname.slice(1)}`;
    return { ...user, userFullName };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products`);
  }

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.url}/carts`);
  }
}
