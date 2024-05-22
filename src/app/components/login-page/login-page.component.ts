import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {MainPageComponent} from "../main-page/main-page.component";
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
    MatLabel
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', Validators.required),
  });

  @Input() startPage!: MainPageComponent;

}
