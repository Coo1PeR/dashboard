import {Component, inject, Input, OnInit} from '@angular/core';
import {GetDataService} from "../../../services/get-data.service";
import {MatTableModule} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-shopping-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButton,
    CurrencyPipe
  ],
  templateUrl: './shopping-table.component.html',
  styleUrl: './shopping-table.component.scss'
})

export class ShoppingTableComponent implements OnInit {
  @Input() userId!: number;
  purchases: any[] = [];
  displayedColumns: string[] = ['title', 'price', 'quantity', 'sum'];

  private getDataService = inject(GetDataService);

  ngOnInit() {
    this.getDataService.getUserPurchases(this.userId).subscribe(purchases => {
      this.purchases = purchases;
    });
    console.log(this.userId)
  }


  decreaseQuantity(purchase: any) {
    if (purchase.quantity > 1) {
      purchase.quantity--;
      purchase.sum = purchase.price * purchase.quantity;
    }
  }
}

