import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { UserFull } from "../../../interfaces/interfaces";
import { AsyncPipe, CommonModule, CurrencyPipe, NgForOf } from "@angular/common";
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GetDataService } from "../../../services/get-data.service";
import { OpenUserCartService } from "../../../services/open-user-cart.service";

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

  usersWithTotalPurchase$!: Observable<UserFull[]>;
  dataSource = new MatTableDataSource<UserFull>();
  displayedColumns: string[] = ['userFullName', 'phone', 'totalPurchase'];
  isLoading = true;

  ngOnInit() {
    this.usersWithTotalPurchase$ = this.getDataService.fetchAllData().pipe(
      tap(users => {
        this.dataSource.data = users;
        this.isLoading = false;
        console.log('Users data:', users); // Логируем данные
      })
    );

    this.usersWithTotalPurchase$.subscribe(users => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onRowClicked(user: UserFull) {
    this.openUserCartService.openUserCartPage(user);
  }
}
