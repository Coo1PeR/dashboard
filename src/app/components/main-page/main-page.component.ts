import {Component, inject} from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from "@angular/material/tabs";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CommonModule} from '@angular/common';
import {UsersTableComponent} from "./users-table/users-table.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {Dialog} from "@angular/cdk/dialog";
import {AddNewUserComponent} from "./add-new-user/add-new-user.component";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SidebarComponent} from "./sidebar/sidebar.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButton,
    MatProgressSpinner,
    CommonModule,
    UsersTableComponent,
    StatisticsComponent,
    MatIcon,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    SidebarComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  dialog = inject(Dialog);

  selectedIndex: number = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  openAddUser() {
    this.dialog.open(AddNewUserComponent, {});
  }
}
