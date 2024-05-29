import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButton
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard';
  private router = inject(Router)

  logout() {
    this.router.navigate(['/login']);
  }
}
