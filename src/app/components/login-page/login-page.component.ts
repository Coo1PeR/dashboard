import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {Store} from "@ngxs/store";
import {SetLoginData} from "../../core/stores/login/login.state";
import {ThemeService} from "../../core/services/theme.service";
import {NgClass} from "@angular/common";
//
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
  themeService: ThemeService = inject(ThemeService);

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;

      this.store.dispatch(new SetLoginData({login: login || '', password: password || '' }))
      this.router.navigate(['/main']);
    }
  }

}
