import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {Store} from "@ngxs/store";
import {SetLoginData} from "../../core/stores/login/login.state";
import {ThemeService} from "../../core/services/theme.service";
import {NgClass} from "@angular/common";
import {AuthService} from "../../core/services/auth.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    RouterLink,
    MatInput,
    MatLabel,
    MatError,
    NgClass
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private store = inject(Store);
  private router = inject(Router);
  private auth = inject(AuthService)
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  themeService: ThemeService = inject(ThemeService);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  onSubmit() {
    if (this.loginForm.valid && this.loginForm.value.username && this.loginForm.value.password) {
      const { username, password } = this.loginForm.value;
      this.auth.login(username, password).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        () =>      this.router.navigate(['/main']),
        error => {
          this.snackBar.open(error.error[0].toUpperCase() + error.error.slice(1), 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      );

      //this.store.dispatch(new SetLoginData({login: username || '', password: password || '' }))
    }
  }

}
