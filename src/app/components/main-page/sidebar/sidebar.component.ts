import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {ThemeService} from "../../../core/services/theme.service";
import {MatIconButton} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {MainPageComponent} from "../main-page.component";

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
export class SidebarComponent {
  themeService: ThemeService = inject(ThemeService);
  private mainPageComponent = inject(MainPageComponent);

  isMobile: boolean | undefined = this.mainPageComponent.isMobile

  toggleTheme() {
    this.themeService.updateTheme()
  }
}
