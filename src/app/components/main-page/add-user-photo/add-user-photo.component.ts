import {Component, ElementRef, inject, input, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Dialog, DialogModule} from "@angular/cdk/dialog";
import {NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {GetDataService} from "../../../services/get-data.service";
import {OpenUserCartService} from "../../../services/open-user-cart.service";

@Component({
  selector: 'app-add-user-photo',
  standalone: true,
  imports: [MatButtonModule, DialogModule, NgIf],
  templateUrl: './add-user-photo.component.html',
  styleUrl: './add-user-photo.component.scss'
})
export class AddUserPhotoComponent {
  public dialog= inject(Dialog)
  private matDialog=inject(MatDialog)
  private getDataService = inject(GetDataService);
  private openUserCartService = inject(OpenUserCartService);



  @ViewChild('dropZone', { static: true }) dropZone!: ElementRef;
  imageUrl: string | ArrayBuffer | null = '';

  initializeDragAndDrop() {
    const dropZoneElement = this.dropZone.nativeElement;

    dropZoneElement.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dropZoneElement.classList.add('drag-over');
    });

    dropZoneElement.addEventListener('dragleave', (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dropZoneElement.classList.remove('drag-over');
    });

    dropZoneElement.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dropZoneElement.classList.remove('drag-over');

      if (event.dataTransfer?.files.length) {
        const file = event.dataTransfer.files[0];
        this.handleFile(file);
      }
    });
  }

  handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;

      // Save the image as a base64 string to the user profile
      if (typeof this.imageUrl === 'string') {
        this.saveUserProfileImage(this.imageUrl);
      }
    };
    reader.readAsDataURL(file);
  }

  saveUserProfileImage(base64Image: string) {
    // Example: Saving to the last user added in the users array
  }

  complete() {

    // Получаем последнего пользователя
    const lastUserIndex = 'userFull.length - 1';
    const lastUser = +'userFull[lastUserIndex]';

    // Закрываем диалог add-photo.component
    this.dialog.closeAll();

    // Открываем страницу с информацией о пользователе
    //this.openUserCartService.openUserCartPage(lastUser);
  }

}
