import {Component, inject, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {UserFull} from "../../interfaces/interfaces";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Store} from "@ngxs/store";
import {UsersState} from "../../store/users/users.state";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatButton} from "@angular/material/button";

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
    RouterLink
  ],
  templateUrl: './user-cart-page.component.html',
  styleUrl: './user-cart-page.component.scss'
})
export class UserCartPageComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private store = inject(Store)
  private router = inject(Router);

  user$!: Observable<UserFull | undefined>

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user$ = this.store.select(UsersState.getUserFull).pipe(
      map(users => users.find(user => user.id === userId))
    );
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}
