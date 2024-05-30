import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngxs/store";
import {UserFull} from "../../../core/interfaces/interface.user";
import {OpenUserCartService} from "../../../core/services/open-user-cart.service";
import {UsersState} from "../../../core/stores/users/users.state";
import {UsersAction} from "../../../core/stores/users/users.actions";
import {MatButton} from "@angular/material/button";
import {Dialog} from "@angular/cdk/dialog";

@Component({
  selector: 'app-add-user-photo',
  standalone: true,
  templateUrl: './add-user-photo.component.html',
  imports: [
    MatButton
  ],
  styleUrls: ['./add-user-photo.component.scss']
})

export class AddUserPhotoComponent implements OnInit{
  @ViewChild('dropZone', {static: true}) dropZone!: ElementRef;
  imageUrl: string | ArrayBuffer | null = '';

  private dialog = inject(Dialog)
  private store = inject(Store)
  private openUserCartService = inject(OpenUserCartService)


  ngOnInit() {
    this.initializeDragAndDrop();
  }

  initializeDragAndDrop() {
    const dropZoneElement = this.dropZone.nativeElement;

    // TODO check @Directive
    ['dragover', 'dragleave'].forEach(eventName => {
      dropZoneElement.addEventListener(eventName, (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        dropZoneElement.classList.toggle('drag-over', eventName === 'dragover');
      });
    });

    dropZoneElement.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dropZoneElement.classList.remove('drag-over');

      const file = event.dataTransfer?.files[0];
      if (file) {
        this.handleFile(file);
      }
    });
  }

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
    this.store.dispatch(new UsersAction.Update(updatedUser))
  };

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
