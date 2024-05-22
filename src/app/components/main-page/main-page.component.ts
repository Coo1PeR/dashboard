import { Component } from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
