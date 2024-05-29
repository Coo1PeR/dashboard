import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {combineLatest} from "rxjs";
import {UserFull} from "../../../interfaces/interfaces.user";
import {AsyncPipe, CommonModule, CurrencyPipe, NgForOf} from "@angular/common";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {OpenUserCartService} from "../../../services/open-user-cart.service";
import {UsersState} from "../../../core/stores/users/users.state";
import {Store} from "@ngxs/store";
import {CartsState} from "../../../core/stores/carts/carts.state";
import {ProductsState} from "../../../core/stores/products/products.state";
import {UsersAction} from "../../../core/stores/users/users.actions";
import {Cart} from "../../../interfaces/interface.cart";
import {Product} from "../../../interfaces/interface.product";

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe, NgForOf, MatTableModule, MatSortModule, MatProgressBarModule, CurrencyPipe, CommonModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private openUserCartService = inject(OpenUserCartService);
  private store = inject(Store);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<UserFull>();
  displayedColumns: string[] = ['userFullName', 'phone', 'totalPurchase'];
  isLoading = true;

  ngOnInit() {
    this.isLoading = true;

    combineLatest([
      this.store.select(UsersState.Users),
      this.store.select(CartsState.Carts),
      this.store.select(ProductsState.Products)
    ]).subscribe(([users, carts, products]) => {
      const updatedUsers = this.processUserData(users, carts, products);
      this.dataSource.data = updatedUsers;
      this.isLoading = false;

      // Диспатч экшена для обновления totalPurchase только если его нет в сторе
      updatedUsers.forEach(user => {
        if (user.totalPurchase === undefined || user.totalPurchase === null) {
          this.store.dispatch(new UsersAction.UpdateTotalPurchase(user.id, user.totalPurchase));
        }
      });
    });

    this.store.select(CartsState.Carts).subscribe(carts => {
      const users = this.dataSource.data;
      const products = this.store.selectSnapshot(ProductsState.Products);
      const updatedUsers = this.processUserData(users, carts, products);
      this.dataSource.data = updatedUsers;

      // Диспатч экшена для обновления totalPurchase
      updatedUsers.forEach(user => {
        this.store.dispatch(new UsersAction.UpdateTotalPurchase(user.id, user.totalPurchase));
      });

      // // Диспатч экшена для обновления только изменившихся totalPurchase
      // updatedUsers.forEach((user, index) => {
      //   if (user.totalPurchase !== users[index].totalPurchase) {
      //     this.store.dispatch(new UsersAction.UpdateTotalPurchase(user.id, user.totalPurchase));
      //   }
      // });
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  processUserData(users: UserFull[], carts: Cart[], products: Product[]): UserFull[] {
    return users.map(user => {
      const userCarts = this.getUserCarts(user.id, carts);
      const totalPurchase = Math.round(this.calculateTotalPurchase(userCarts, products));
      return { ...user, totalPurchase };
    });
  }

  private getUserCarts(userId: number, carts: Cart[]): Cart[] {
    return carts.filter(cart => cart.userId === userId);
  }

  private calculateCartTotal(cart: Cart, products: Product[]): number {
    return cart.products.reduce((cartTotal, cartProduct) => {
      const product = products.find(product => product.id === cartProduct.productId);
      return cartTotal + (product ? product.price * cartProduct.quantity : 0);
    }, 0);
  }

  private calculateTotalPurchase(userCarts: Cart[], products: Product[]): number {
    return userCarts.reduce((total, cart) => total + this.calculateCartTotal(cart, products), 0);
  }

  onRowClicked(user: UserFull) {
    this.openUserCartService.openUserCartPage(user);
  }
}
