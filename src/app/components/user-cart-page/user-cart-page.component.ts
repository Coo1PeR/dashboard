import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserFull } from '../../core/interfaces/interface.user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { UsersState } from '../../core/stores/users/users.state';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import {ShoppingTableComponent} from "./shopping-table/shopping-table.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-user-cart-page',
  standalone: true,
  imports: [
    MatProgressBar,
    AsyncPipe,
    NgIf,
    MatCard,
    MatCardContent,
    MatGridList,
    MatGridTile,
    MatButton,
    RouterLink,
    ShoppingTableComponent
  ],
  templateUrl: './user-cart-page.component.html',
  styleUrls: ['./user-cart-page.component.scss']
})
export class UserCartPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @ViewChild(ShoppingTableComponent) child: ShoppingTableComponent | undefined;


  user$!: Observable<UserFull | undefined>;

  ngOnInit(): void {
    let userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user$ = this.store.select(UsersState.Users).pipe(
      map(users => users.find(user => user.id === userId)),
      //takeUntilDestroyed(this.child?.destroyRef)
    );
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}
