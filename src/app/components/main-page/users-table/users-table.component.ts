import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import {combineLatest, Observable, tap} from "rxjs";
import {Cart, Product, UserFull} from "../../../interfaces/interfaces";
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf } from "@angular/common";
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GetDataService } from "../../../services/get-data.service";
import { OpenUserCartService } from "../../../services/open-user-cart.service";
import {UsersState} from "../../../store/users/users.state";
import {Store} from "@ngxs/store";
import {UsersAction} from "../../../store/users/users.actions";
import {CartsAction} from "../../../store/carts/carts.actions";
import {ProductsAction} from "../../../store/products/products.actions";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe, NgForOf, MatTableModule, MatSortModule, MatProgressBarModule, CurrencyPipe, CommonModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  private getDataService = inject(GetDataService)
  private openUserCartService = inject(OpenUserCartService);

  @ViewChild(MatSort) sort!: MatSort;

  users$: Observable<UserFull[]>;
  usersWithTotalPurchase$!: Observable<UserFull[]>;
  dataSource = new MatTableDataSource<UserFull>();
  displayedColumns: string[] = ['userFullName', 'phone', 'totalPurchase'];
  isLoading = true;

  constructor(private store: Store) {
    this.users$ = this.store.select(UsersState.getUserFull);
  }

  ngOnInit() {
      combineLatest([
        this.store.dispatch(new UsersAction.Fetch()),
        this.store.dispatch(new CartsAction.Fetch()),
        this.store.dispatch(new ProductsAction.Fetch())
      ]).subscribe(() => {
        this.getDataService.totalPurchase().subscribe((usersWithTotal: UserFull[]) => {
          this.store.dispatch(new UsersAction.UpdateTotalPurchase(usersWithTotal)).subscribe(() => {
            this.store.select(UsersState.getUserFull).subscribe((users: UserFull[]) => {
              this.dataSource.data = users;
              this.isLoading = false;
            });
          });
        });
      });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onRowClicked(user: UserFull) {
    this.openUserCartService.openUserCartPage(user);
  }
}
