import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Select} from "@ngxs/store";
import {CartsState} from "../../../core/stores/carts/carts.state";
import {UserFull} from "../../../core/interfaces/interface.user";
import {ProductsState} from "../../../core/stores/products/products.state";
import {UsersState} from "../../../core/stores/users/users.state";
import {Cart} from "../../../core/interfaces/interface.cart";
import {Product} from "../../../core/interfaces/interface.product";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ThemeService} from "../../../core/services/theme.service";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
  fill: ApexFill
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
  @Select(UsersState.Users) users$!: Observable<UserFull[]>;

  color: string = '#B4ABB0'

  @ViewChild("chart") chart: ChartComponent | undefined;
  public productsChartOptionsApex: Partial<ChartOptions> | any;
  public usersChartOptionsApex: Partial<ChartOptions> | any;

  productData: { productTitle: string, productTotalPurchase: number }[] = [];
  userData: { userFullName: string, userTotalPurchaseSum: number }[] = [];

  themeService: ThemeService = inject(ThemeService);
  // Injecting DestroyRef
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadProductData();
    this.loadUserData();
  }

  public renderProductChartApex(data: { productTitle: string, productTotalPurchase: number }[]) {
    this.productsChartOptionsApex = {
      series: [{
        name: 'кол-во',
        data: data.map(item => item.productTotalPurchase)
      }],
      chart: {
        height: 'auto',
        type: 'bar',
        fontFamily: 'Comfortaa, sans-serif',
        foreColor: this.color,
      },
      title: {
        text: 'Количество проданных товаров',
        style: {
          color: this.color
        }
      },
      xaxis: {
        labels: {
          trim: true,
          rotate: -45,
          maxHeight: 120,
          style: {
            colors: this.color
          }
        },
        categories: data.map(item => item.productTitle)
      },
      fill: {
        colors: [function (series: any) {
          if (series.dataPointIndex % 2 === 0) {
            return '#F4B88E'
          } else {
            return '#CA726F'
          }
        }],
        opacity: 1,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "60%",
        }
      },
    };
  }

  public renderUserChartApex(data: { userFullName: string, userTotalPurchaseSum: number }[]) {
    this.usersChartOptionsApex = {
      series: [{
        name: 'сумма',
        data: data.map(item => item.userTotalPurchaseSum)
      }],
      chart: {
        height: 'auto',
        type: 'bar',
        fontFamily: 'Comfortaa, sans-serif',
        foreColor: this.color,
      },
      title: {
        text: 'Пользователи и их общая сумма покупок',
        style: {
          color: this.color
        }
      },
      xaxis: {
        categories: data.map(item => item.userFullName),
        labels: {
          style: {
            colors: this.color
          }
        }
      },
      fill: {
        colors: [function (series: any) {
          if (series.dataPointIndex % 2 === 0) {
            return '#F4B88E'
          } else {
            return '#CA726F'
          }
        }],
        opacity: 1,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "60%",
        }
      },
    };
  }

  calculateProductRatio(): Observable<{ productTitle: string, productTotalPurchase: number }[]> {
    return combineLatest([this.carts$, this.products$]).pipe(
      map(([carts, products]) => this.calculateProductTotals(carts, products))
    );
  }

  getUserData(): Observable<{ userFullName: string, userTotalPurchaseSum: number }[]> {
    return this.users$.pipe(
      map((users: UserFull[]) => {
        return users.map(user => ({
          userFullName: user.userFullName,
          userTotalPurchaseSum: user.totalPurchase
        }));
      })
    );
  }

  private loadProductData() {
    this.calculateProductRatio()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.productData = data;
        this.renderProductChartApex(data);
      });
  }

  private loadUserData() {
    this.getUserData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.userData = data;
        this.renderUserChartApex(data);
      });
  }

  private calculateProductTotals(carts: Cart[], products: Product[]): {
    productTitle: string,
    productTotalPurchase: number
  }[] {
    const productMap: { [key: number]: Product } = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {} as { [key: number]: Product });

    const productTotals: { [key: number]: number } = carts.reduce((acc, cart) => {
      cart.products.forEach(cartProduct => {
        acc[cartProduct.productId] = (acc[cartProduct.productId] || 0) + cartProduct.quantity;
      });
      return acc;
    }, {} as { [key: number]: number });

    return Object.entries(productTotals).map(([productId, productTotalPurchase]) => {
      const product = productMap[+productId];
      return {
        productTitle: product?.title ?? 'Unknown Product',
        productTotalPurchase: productTotalPurchase
      };
    });
  }
}
