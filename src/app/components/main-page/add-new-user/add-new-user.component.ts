import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AddUserPhotoComponent } from "../add-user-photo/add-user-photo.component";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatDivider } from "@angular/material/divider";
import { MatButton } from "@angular/material/button";
import { UsersAction } from "../../../core/stores/users/users.actions";
import { Store } from "@ngxs/store";
import { UserFull } from "../../../core/interfaces/interface.user";
import { UsersState } from "../../../core/stores/users/users.state";
import {MatDialog} from "@angular/material/dialog";
import {NgClass} from "@angular/common";
import {ThemeService} from "../../../core/services/theme.service";

@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDivider,
    MatButton,
    MatLabel,
    MatError,
    NgClass
  ],
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent {
  dialog = inject(MatDialog);
  private store = inject(Store);
  themeService: ThemeService = inject(ThemeService);

  // Создаем форму для нового пользователя
  newUserForm = new FormGroup({
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\+?[0-9()\\- ].{8,}'),
    ]),
  });

  // Константные поля для нового пользователя
  private static defaultAddress = {
    geolocation: {
      lat: 0,
      long: 0,
    },
    city: '',
    street: '',
    number: 0,
    zipcode: '',
  };

  private static defaultProfileImage = '';
  private static defaultTotalPurchase = 0;
  private static defaultUsername = '';
  private static defaultPassword = '';

  addUser() {


    const lastName = this.newUserForm.value.lastName?.toLowerCase() ?? '';
    const firstName = this.newUserForm.value.firstName?.toLowerCase() ?? '';
    const email = this.newUserForm.value.email?.toLowerCase() ?? '';
    const phone = this.newUserForm.value.phone?.toLowerCase() ?? '';

    const users: UserFull[] = this.store.selectSnapshot(UsersState.Users);
    const id = Math.max(...users.map(user => user.id)) + 1;

    const newUser: UserFull = {
      address: AddNewUserComponent.defaultAddress,
      id: id,
      email: email,
      username: AddNewUserComponent.defaultUsername,
      password: AddNewUserComponent.defaultPassword,
      name: {
        firstname: firstName,
        lastname: lastName,
      },
      phone: phone,
      __v: 0,
      totalPurchase: AddNewUserComponent.defaultTotalPurchase,
      userFullName: `${lastName.charAt(0).toUpperCase()}${lastName.slice(1)} ${firstName.charAt(0).toUpperCase()}${firstName.slice(1)}`,
      profileImage: AddNewUserComponent.defaultProfileImage,
    };

    console.log(newUser);

    this.store.dispatch(new UsersAction.AddUser(newUser));
  }

  async openAddPhoto() {
    this.dialog.open(AddUserPhotoComponent, {});
  }
}
