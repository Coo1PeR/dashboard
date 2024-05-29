import {Component, inject, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {Store} from "@ngxs/store";
import {SetLoginData} from "../../store/login/login.state";
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
    MatError
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private store = inject(Store);
  private router = inject(Router);

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      // TODO refactor to form.value; also remove as
      const login = this.loginForm.get('login')?.value as string;
      const password = this.loginForm.get('password')?.value as string;

      this.store.dispatch(new SetLoginData({login, password}))
      this.router.navigate(['/main']);

      console.log(`Login: ${login}`)
      console.log(`Password: ${password}`)
    }
  }

}
