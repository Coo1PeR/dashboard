import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {combineLatest, of} from "rxjs";
import {UserFull} from "../../../interfaces/interfaces";
import {AsyncPipe, CommonModule, CurrencyPipe, NgForOf} from "@angular/common";
import {MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTableDataSource} from '@angular/material/table';
import {GetDataService} from "../../../services/get-data.service";
import {OpenUserCartService} from "../../../services/open-user-cart.service";
import {UsersState} from "../../../store/users/users.state";
import {Store} from "@ngxs/store";
import {UsersAction} from "../../../store/users/users.actions";
import {CartsAction} from "../../../store/carts/carts.actions";
import {ProductsAction} from "../../../store/products/products.actions";
import {switchMap} from "rxjs/operators";
import {CartsState} from "../../../store/carts/carts.state";

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe, NgForOf, MatTableModule, MatSortModule, MatProgressBarModule, CurrencyPipe, CommonModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private getDataService = inject(GetDataService);
  private openUserCartService = inject(OpenUserCartService);
  private store = inject(Store);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<UserFull>();
  displayedColumns: string[] = ['userFullName', 'phone', 'totalPurchase'];
  isLoading = true;

  ngOnInit() {
    // First check if we have any data in the store
    // TODO try refactor
    this.store.selectOnce(UsersState.getUserFull).pipe(
      switchMap(users => {
        if (users.length === 0) {
          // If no data, dispatch actions to fetch it
          return combineLatest([
            this.store.dispatch(new UsersAction.Fetch()),
            this.store.dispatch(new CartsAction.Fetch()),
            this.store.dispatch(new ProductsAction.Fetch())
          ]).pipe(
            switchMap(() => this.getDataService.totalPurchase()),
            switchMap((usersWithTotal: UserFull[]) =>
              this.store.dispatch(new UsersAction.UpdateTotalPurchase(usersWithTotal))
            ),
            switchMap(() => this.store.select(UsersState.getUserFull))
          );
        } else {
          return of(users);
        }
      })
    ).subscribe((users: UserFull[]) => {
      this.dataSource.data = users;
      this.isLoading = false;
    });

    this.dataSource.data = this.store.selectSnapshot(UsersState.getUserFull);

    ///////////////////////////////////////////////
    // this.store.selectOnce(UsersState.getUserFull).pipe(
    //   switchMap(users => {
    //     if (users.length === 0) {
    //       // If no data, dispatch actions to fetch it
    //       return combineLatest([
    //         this.store.dispatch(new UsersAction.Fetch()),
    //         this.store.dispatch(new CartsAction.Fetch()),
    //         this.store.dispatch(new ProductsAction.Fetch())
    //       ]);
    //     } else {
    //       return of(users);
    //     }
    //   })
    // ).pipe(
    //   switchMap(() => this.store.select(UsersState.getUserFull))
    // ).subscribe((users: UserFull[]) => {
    //   this.dataSource.data = users;
    //   this.isLoading = false;
    // });
    //
    // this.store.select(UsersState.getUserFull).subscribe((users: UserFull[]) => {
    //   this.dataSource.data = users;
    // });
    //
    // this.store.select(CartsState.getCartsFull).pipe(
    //   switchMap(() => this.getDataService.totalPurchase()),
    //   switchMap((usersWithTotal: UserFull[]) =>
    //     this.store.dispatch(new UsersAction.UpdateTotalPurchase(usersWithTotal))
    //   )
    // ).subscribe();
  }

  ngAfterViewInit() {
    // TODO check how many times invoke
    this.dataSource.sort = this.sort;
  }

  onRowClicked(user: UserFull) {
    this.openUserCartService.openUserCartPage(user);
  }
}
