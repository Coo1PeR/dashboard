import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ReactiveFormsModule} from "@angular/forms";
import {ThemeService} from "../../../core/services/theme.service";
import {MatIconButton} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {MainPageComponent} from "../main-page.component";
import {AuthService} from "../../../core/services/auth.service";

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
  authService: AuthService = inject(AuthService);
  private mainPageComponent = inject(MainPageComponent);
  private router = inject(Router);

  isMobile: boolean | undefined = this.mainPageComponent.isMobile

  toggleTheme() {
    this.themeService.updateTheme()
  }

  logOut() {
    this.authService.logOut()
    this.router.navigate(['/login']);
  }
}
