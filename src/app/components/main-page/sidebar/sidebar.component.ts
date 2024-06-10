import {Component, inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {ThemeService} from "../../../core/services/theme.service";
import {MatIconButton} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIcon,
    MatListItem,
    MatNavList,
    RouterLink,
    RouterLinkActive,
    MatDivider,
    MatSlideToggle,
    ReactiveFormsModule,
    MatIconButton,
    NgClass,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  themeService: ThemeService = inject(ThemeService);
  private breakpointObserver = inject(BreakpointObserver);

  isMobile: boolean | undefined

  toggleTheme() {
    this.themeService.updateTheme()
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
      console.log(result.matches)
    });
  }
}
