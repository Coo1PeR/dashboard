import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CommonModule} from '@angular/common';
import {UsersTableComponent} from "./users-table/users-table.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
    RouterOutlet,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit{
  dialog = inject(MatDialog);
  public breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  isMobile: boolean | undefined

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

}
