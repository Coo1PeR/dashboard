import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild, CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from "../core/services/auth.service";
import {inject} from "@angular/core";
import {Observable, of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

// export class AuthGuard implements CanActivate, CanActivateChild {
//   authService: AuthService = inject(AuthService);
//   snackBar = inject(MatSnackBar);
//   router = inject(Router);
//
//   canActivate(): Observable<boolean> {
//     if (!this.authService.isAuthenticated()) {
//       this.snackBar.open('To gain access, please log in first.', 'Close', {
//         duration: 3000,
//       });
//       this.router.navigate(['/login']);
//       return of(false);
//     }
//     return of(true);
//   }
//
//   canActivateChild = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => this.canActivateChild(route, state);
// }

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    snackBar.open('To gain access, please log in first.', 'Close', {
      duration: 5000,
      verticalPosition: 'top',
    });
    router.navigate(['/login']);
    return false;
  }
  return true;
}

export const AuthGuardChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthGuard(route, state);

