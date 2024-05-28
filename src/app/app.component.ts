import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginPageComponent,
    HttpClientModule,
    CanvasJSAngularChartsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard';
}
