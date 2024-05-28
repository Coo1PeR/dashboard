import { Component, OnInit, inject } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { StatisticsService } from '../../../services/statistics.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CanvasJSAngularChartsModule
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  public productChartOptions: object | undefined;
  public userChartOptions: object | undefined;
  private statisticsService = inject(StatisticsService);

  productData: { productTitle: string, productTotalPurchase: number }[] = [];
  userData: { userFullName: string, userTotalPurchaseSum: number }[] = [];

  ngOnInit() {
    this.loadProductsData();
    this.loadUsersData();
  }

  private loadProductsData() {
    this.statisticsService.calculateProductRatio().subscribe(data => {
      this.productData = data;
      this.renderProductChart();
    });
  }

  private loadUsersData() {
    this.statisticsService.calculateTotalPurchase().subscribe(data => {
      this.userData = data;
      this.renderUserChart();
    });
  }

  public renderProductChart() {
    this.productChartOptions = {
      title: {
        text: 'Соотношение купленных всех видов товаров и их количества'
      },
      data: [{
        type: 'column',
        dataPoints: this.productData.map(item => ({ label: item.productTitle, y: item.productTotalPurchase }))
      }]
    };
  }

  public renderUserChart() {
    this.userChartOptions = {
      title: {
        text: 'Пользователи и их общая сумма покупок'
      },
      data: [{
        type: 'column',
        dataPoints: this.userData.map(item => ({ label: item.userFullName, y: item.userTotalPurchaseSum }))
      }]
    };
  }
}
