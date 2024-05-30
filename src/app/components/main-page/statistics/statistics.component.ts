import { Component, OnInit, ViewChild, inject, DestroyRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartComponent, NgApexchartsModule, ApexChart, ApexYAxis, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries } from "ng-apexcharts";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Select } from "@ngxs/store";
import { CartsState } from "../../../core/stores/carts/carts.state";
import { UserFull } from "../../../interfaces/interface.user";
import { ProductsState } from "../../../core/stores/products/products.state";
import { UsersState } from "../../../core/stores/users/users.state";
import { Cart } from "../../../interfaces/interface.cart";
import { Product } from "../../../interfaces/interface.product";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
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

  @ViewChild("chart") chart: ChartComponent | undefined;
  public productsChartOptionsApex: Partial<ChartOptions> | any;
  public usersChartOptionsApex: Partial<ChartOptions> | any;

  productData: { productTitle: string, productTotalPurchase: number }[] = [];
  userData: { userFullName: string, userTotalPurchaseSum: number }[] = [];

  // Injecting DestroyRef
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadProductData();
    this.loadUserData();
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
    this.calculateTotalPurchase()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.userData = data;
        this.renderUserChartApex(data);
      });
  }

  public renderProductChartApex(data: { productTitle: string, productTotalPurchase: number }[]) {
    this.productsChartOptionsApex = {
      series: [{
        name: 'кол-во',
        data: data.map(item => item.productTotalPurchase)
      }],
      chart: {
        height: 'auto',
        type: 'bar'
      },
      title: {
        text: 'Количество проданных товаров'
      },
      xaxis: {
        labels: {
          trim: true,
          rotate: -45,
          maxHeight: 120,

        },
        categories: data.map(item => item.productTitle)
      }
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

  calculateTotalPurchase(): Observable<{ userFullName: string, userTotalPurchaseSum: number }[]> {
    return this.users$.pipe(
      map((users: UserFull[]) => {
        return users.map(user => ({
          userFullName: user.userFullName,
          userTotalPurchaseSum: user.totalPurchase
        }));
      })
    );
  }
}
