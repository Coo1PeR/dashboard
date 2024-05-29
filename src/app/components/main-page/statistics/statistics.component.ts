import {Component, OnInit, inject, ViewChild} from '@angular/core';
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
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Select, Store} from "@ngxs/store";
import {CartsState} from "../../../core/stores/carts/carts.state";
import {Cart, Product, UserFull} from "../../../interfaces/interfaces";
import {ProductsState} from "../../../core/stores/products/products.state";
import {UsersState} from "../../../core/stores/users/users.state";

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
  @Select(CartsState.Carts) carts$!: Observable<Cart[]>;
  @Select(ProductsState.Products) products$!: Observable<Product[]>;
  private store = inject(Store);

  @ViewChild("chart") chart: ChartComponent | undefined;
  public productsChartOptionsApex: Partial<ChartOptions> | any;
  public usersChartOptionsApex: Partial<ChartOptions> | any;

  productData: { productTitle: string, productTotalPurchase: number }[] = [];
  userData: { userFullName: string, userTotalPurchaseSum: number }[] = [];

  ngOnInit() {
    this.loadProductData();
    this.loadUserData();
  }

  private loadProductData() {
    this.calculateProductRatio().subscribe(data => {
      this.productData = data;
      this.renderProductChartApex(data);
    });
  }

  private loadUserData() {
    this.calculateTotalPurchase().subscribe(data => {
      this.userData = data;
      this.renderUserChartApex(data);
    });
  }

  public renderProductChartApex(data: { productTitle: string, productTotalPurchase: number }[]) {
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
  }

  public renderUserChartApex(data: { userFullName: string, userTotalPurchaseSum: number }[]) {
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
  }

  calculateProductRatio(): Observable<{ productTitle: string, productTotalPurchase: number }[]> {
    return combineLatest([this.carts$, this.products$]).pipe(
      map(([carts, products]) => this.calculateProductTotals(carts, products))
    );
  }

  private calculateProductTotals(carts: Cart[], products: Product[]): { productTitle: string, productTotalPurchase: number }[] {
    const productMap = carts.reduce((acc, cart) => {
      cart.products.forEach(product => {
        acc.set(product.productId, (acc.get(product.productId) || 0) + product.quantity);
      });
      return acc;
    }, new Map<number, number>());

    return Array.from(productMap.entries()).map(([productId, productTotalPurchase]) => {
      const product = products.find(p => p.id === productId);
      return {
        productTitle: product ? product.title : 'Unknown Product',
        productTotalPurchase: productTotalPurchase
      };
    });
  }

  // Метод для подсчета общей суммы покупок пользователей
  calculateTotalPurchase(): Observable<{ userFullName: string, userTotalPurchaseSum: number }[]> {
    // TODO check takeUntilDestroyed
    // TODO check stores.selectSnapshot
    return this.store.select(UsersState.Users).pipe(
      map((users: UserFull[]) => {
        return users.map(user => ({
          userFullName: user.userFullName,
          userTotalPurchaseSum: user.totalPurchase
        }));
      })
    );
  }
}
