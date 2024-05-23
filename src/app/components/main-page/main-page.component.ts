import { Component } from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {LoginState} from "../../store/login/login.state";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import { CommonModule } from '@angular/common';
import {UsersTableComponent} from "./users-table/users-table.component";
import {StatisticsComponent} from "./statistics/statistics.component";


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
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  @Select(LoginState.getLogin) login$!: Observable<string>;
  @Select(LoginState.getPassword) password$!: Observable<string>;
}
