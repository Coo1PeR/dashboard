import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Dialog} from "@angular/cdk/dialog";
import {AddUserPhotoComponent} from "../add-user-photo/add-user-photo.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDivider,
    MatButton,
    MatLabel
  ],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.scss'
})
export class AddNewUserComponent {
  dialog = inject(Dialog);


  newUserForm = new FormGroup({
    lastName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\+?[0-9()\\- ].{8,}'),
    ]),
  });

  addUser() {
    let userNew = {
      lastName: this.newUserForm.value.lastName?.toLowerCase() ?? '',
      firstName: this.newUserForm.value.firstName?.toLowerCase() ?? '',
      email: this.newUserForm.value.email?.toLowerCase() ?? '',
      phone: this.newUserForm.value.phone?.toLowerCase() ?? '',
    }
    console.log(userNew)
  }


  async openAddPhoto() {
    this.dialog.open(AddUserPhotoComponent, {}); // Открываем новое диалоговое окно
  }
}


