import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Dialog} from "@angular/cdk/dialog";
import {AddUserPhotoComponent} from "../add-user-photo/add-user-photo.component";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {UsersAction} from "../../../core/stores/users/users.actions";
import {Store} from "@ngxs/store";
import {UserFull} from "../../../interfaces/interfaces.user";
import {UsersState} from "../../../core/stores/users/users.state";

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
    MatError
  ],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.scss'
})
export class AddNewUserComponent {
  dialog = inject(Dialog);
  private store = inject(Store)


  newUserForm = new FormGroup({
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\+?[0-9()\\- ].{8,}'),
    ]),
  });

  addUser() {
    const lastName = this.newUserForm.value.lastName?.toLowerCase() ?? '';
    const firstName = this.newUserForm.value.firstName?.toLowerCase() ?? '';
    const email = this.newUserForm.value.email?.toLowerCase() ?? '';
    const phone = this.newUserForm.value.phone?.toLowerCase() ?? '';
    let id: number = +'';

    this.store.selectOnce(UsersState.Users).subscribe((users: UserFull[]) => {
      id = Math.max(...users.map((user) => user.id)) + 1;
    });

    //TODO Refactor
    let newUser: UserFull = {
      address: {
        geolocation: {
          lat: 0,
          long: 0,
        },
        city: '',
        street: '',
        number: 0,
        zipcode: '',
      },
      id: id,
      email: email,
      username: '',
      password: '',
      name: {
        firstname: firstName,
        lastname: lastName,
      },
      phone: phone,
      __v: 0,
      totalPurchase: 0,
      userFullName: `${lastName.charAt(0).toUpperCase()}${lastName.slice(1)} ${firstName.charAt(0).toUpperCase()}${firstName.slice(1)}`,
      profileImage: '',
    }
    console.log(newUser)
    this.store.dispatch(new UsersAction.AddUser(newUser));

  }

  async openAddPhoto() {
    this.dialog.open(AddUserPhotoComponent, {}); // Открываем новое диалоговое окно
  }
}


