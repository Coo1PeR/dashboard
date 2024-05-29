import {Component, OnInit, inject, ViewChild} from '@angular/core';
import {StatisticsService} from '../../../services/statistics.service';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgApexchartsModule,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})

export class StatisticsComponent implements OnInit {
  private statisticsService = inject(StatisticsService);

  /////////////
  @ViewChild("chart") chart: ChartComponent | undefined;
  public productsChartOptionsApex: Partial<ChartOptions> | any
  public usersChartOptionsApex: Partial<ChartOptions> | any

  productData: { productTitle: string, productTotalPurchase: number }[] = [];
  userData: { userFullName: string, userTotalPurchaseSum: number }[] = [];

  ngOnInit() {
    this.loadProductsData();
    this.loadUsersData();

    ////////////////////////
  }

  private loadProductsData() {
    this.statisticsService.calculateProductRatio().subscribe(data => {
      this.productData = data;
      this.renderProductChartApex()
    });
  }

  private loadUsersData() {
    this.statisticsService.calculateTotalPurchase().subscribe(data => {
      this.userData = data;
      this.renderUserChartApex();
    });
  }

  /////////////////
  public renderProductChartApex() {
    this.statisticsService.calculateProductRatio().subscribe(data => {
      this.productsChartOptionsApex = {
        series: [{
          data: data.map(item => item.productTotalPurchase)
        }],
        chart: {
          height: 350,
          type: 'bar'
        },
        title: {
          text: 'Соотношение купленных всех видов товаров и их количества'
        },
        xaxis: {
          categories: data.map(item => item.productTitle)
        }
      };
    });
  }

  public renderUserChartApex() {
    this.statisticsService.calculateTotalPurchase().subscribe(data => {
      this.usersChartOptionsApex = {
        series: [{
          title: 'Сумма покупок',
          data: data.map(item => item.userTotalPurchaseSum)
        }],
        chart: {
          height: 350,
          type: 'bar'
        },
        title: {
          text: 'Пользователи и их общая сумма покупок'
        },
        xaxis: {
          categories: data.map(item => item.userFullName)
        }
      };
    });
  }
}
