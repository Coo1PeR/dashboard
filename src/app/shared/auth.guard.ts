import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from "../core/services/auth.service";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

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

