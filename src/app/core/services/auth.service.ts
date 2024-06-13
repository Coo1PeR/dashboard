import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.url}/auth/login`, {username, password})
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('token', token);
            if (username === 'johnd') {
              localStorage.setItem('role', 'admin');
            } else {
              localStorage.setItem('role', 'user');
            }
          }
        )
      )
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
