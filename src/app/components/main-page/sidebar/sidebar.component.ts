import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatDividerModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private overlay = inject(OverlayContainer);

  switchTheme = new FormControl(false);
  @HostBinding('class') className = '';
  darkClass = 'dark-theme';
  lightClass = 'light-theme';

  constructor() {}

  ngOnInit() {
    this.switchTheme.valueChanges.subscribe(currentMode => {
      this.className = currentMode ? this.darkClass : this.lightClass;
      const overlayContainerClasses = this.overlay.getContainerElement().classList;
      if (currentMode) {
        overlayContainerClasses.add(this.darkClass);
        overlayContainerClasses.remove(this.lightClass);
      } else {
        overlayContainerClasses.add(this.lightClass);
        overlayContainerClasses.remove(this.darkClass);
      }
    });
    // Set initial theme
    this.className = this.switchTheme.value ? this.darkClass : this.lightClass;
    const overlayContainerClasses = this.overlay.getContainerElement().classList;
    if (this.switchTheme.value) {
      overlayContainerClasses.add(this.darkClass);
    } else {
      overlayContainerClasses.add(this.lightClass);
    }
  }
}
