import {Component, HostBinding, HostListener, inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {OverlayContainer} from "@angular/cdk/overlay";

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
    ReactiveFormsModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  private overlay = inject(OverlayContainer);

  switchTheme = new FormControl(false)
  @HostBinding('class') className = ''
  darkClass = 'theme-dark'
  lightClass = 'theme-light'

  constructor() {
  }

  ngOnInit() {
    this.switchTheme.valueChanges.subscribe(currentMode => {
      this.className = currentMode? this.darkClass : this.lightClass;
      if(currentMode) {
        this.overlay.getContainerElement().classList.add(this.darkClass);
      } else {
        this.overlay.getContainerElement().classList.remove(this.darkClass);
      }
    })
  }
}
