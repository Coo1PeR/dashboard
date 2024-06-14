import {AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {combineLatest} from "rxjs";
import {UserFull} from "../../../core/interfaces/interface.user";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {OpenUserCartService} from "../../../core/services/open-user-cart.service";
import {UsersState} from "../../../core/stores/users/users.state";
import {Store} from "@ngxs/store";
import {CartsState} from "../../../core/stores/carts/carts.state";
import {ProductsState} from "../../../core/stores/products/products.state";
import {UsersAction} from "../../../core/stores/users/users.actions";
import {Cart} from "../../../core/interfaces/interface.cart";
import {Product} from "../../../core/interfaces/interface.product";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {RouterLink} from "@angular/router";
import {AddNewUserComponent} from "../add-new-user/add-new-user.component";
import {MatButton} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule, MatDialogModule, MatTableModule, MatSortModule, MatProgressBarModule, CurrencyPipe, CommonModule, RouterLink, MatButton],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private openUserCartService = inject(OpenUserCartService);
  private store = inject(Store);
  dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<UserFull>();
  displayedColumns: string[] = ['userFullName', 'phone', 'totalPurchase'];
  isLoading: boolean = true;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {

    combineLatest([
      this.store.selectOnce(UsersState.Users),
      this.store.selectOnce(CartsState.Carts),
      this.store.selectOnce(ProductsState.Products)
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([users, carts, products]) => {
      const updatedUsers = this.processUserData(users, carts, products);
      this.dataSource.data = updatedUsers;
      updatedUsers.forEach(user => {
          this.store.dispatch(new UsersAction.UpdateTotalPurchase(user.id, user.totalPurchase));
      });
      this.isLoading = false;
    });

    this.store.select(CartsState.Carts).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(carts => {
      const users = this.dataSource.data;
      const products = this.store.selectSnapshot(ProductsState.Products);
      const updatedUsers = this.processUserData(users, carts, products);
      this.dataSource.data = updatedUsers;

      updatedUsers.forEach((user, index) => {
        if (user.totalPurchase !== users[index].totalPurchase) {
          this.store.dispatch(new UsersAction.UpdateTotalPurchase(user.id, user.totalPurchase));
        }
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  processUserData(users: UserFull[], carts: Cart[], products: Product[]): UserFull[] {
    return users.map(user => {
      const userCarts = this.getUserCarts(user.id, carts);
      const totalPurchase = parseFloat(this.calculateTotalPurchase(userCarts, products).toFixed(2));
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

  openAddUser() {
    this.dialog.open(AddNewUserComponent, {});
  }
}
