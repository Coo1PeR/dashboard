import { Component, inject, OnInit } from '@angular/core';
import { Store } from "@ngxs/store";
import { UserFull } from "../../../core/interfaces/interface.user";
import { OpenUserCartService } from "../../../core/services/open-user-cart.service";
import { UsersState } from "../../../core/stores/users/users.state";
import { UsersAction } from "../../../core/stores/users/users.actions";
import { MatButton } from "@angular/material/button";
import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from '@angular/common';
import { DragDropDirective } from '../../../shared/drag-and-drop.directive'

@Component({
  selector: 'app-add-user-photo',
  standalone: true,
  templateUrl: './add-user-photo.component.html',
  imports: [
    MatButton,
    CommonModule,
    DragDropDirective
  ],
  styleUrls: ['./add-user-photo.component.scss']
})

export class AddUserPhotoComponent implements OnInit {
  imageUrl: string | ArrayBuffer | null = '';

  private dialog = inject(Dialog);
  private store = inject(Store);
  private openUserCartService = inject(OpenUserCartService);

  ngOnInit() {}

  handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;

      const lastUser = this.getLastUser();
      if (lastUser) {
        const updatedUser: UserFull = {
          ...lastUser,
          profileImage: reader.result as string
        };
        this.updateUserProfile(updatedUser);
      }
    };
    reader.readAsDataURL(file);
  }

  updateUserProfile(updatedUser: UserFull) {
    this.store.dispatch(new UsersAction.Update(updatedUser));
  }

  complete() {
    this.dialog.closeAll();
    const lastUser = this.getLastUser();
    if (lastUser) {
      this.openUserCartService.openUserCartPage(lastUser);
    }
  }

  getLastUser(): UserFull | undefined {
    const users = this.store.selectSnapshot(UsersState.Users);
    return users.length > 0 ? users[users.length - 1] : undefined;
  }
}
