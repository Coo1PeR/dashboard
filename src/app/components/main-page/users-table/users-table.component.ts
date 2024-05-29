import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {combineLatest} from "rxjs";
import {Cart, Product, UserFull} from "../../../interfaces/interfaces";
import {AsyncPipe, CommonModule, CurrencyPipe, NgForOf} from "@angular/common";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {OpenUserCartService} from "../../../services/open-user-cart.service";
import {UsersState} from "../../../core/stores/users/users.state";
import {Store} from "@ngxs/store";
import {CartsState} from "../../../core/stores/carts/carts.state";
import {ProductsState} from "../../../core/stores/products/products.state";

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
      this.store.select(UsersState.getUserFull),
      this.store.select(CartsState.getCartsFull),
      this.store.select(ProductsState.getProductsFull)
    ]).subscribe(([users, carts, products]) => {
      this.dataSource.data = this.processUserData(users, carts, products);
      this.isLoading = false;
    });

    this.store.select(CartsState.getCartsFull).subscribe(carts => {
      const users = this.dataSource.data;
      const products = this.store.selectSnapshot(ProductsState.getProductsFull);
      this.dataSource.data = this.processUserData(users, carts, products);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  processUserData(users: UserFull[], carts: Cart[], products: Product[]): UserFull[] {
    return users.map(user => {
      const userCarts = carts.filter(cart => cart.userId === user.id);
      const totalPurchase = userCarts.reduce((total, cart) => {
        return total + cart.products.reduce((cartTotal, cartProduct) => {
          const product = products.find(product => product.id === cartProduct.productId);
          return cartTotal + (product ? product.price * cartProduct.quantity : 0);
        }, 0);
      }, 0);

      return {...user, totalPurchase};
    });
  }

  onRowClicked(user: UserFull) {
    this.openUserCartService.openUserCartPage(user);
  }
}
