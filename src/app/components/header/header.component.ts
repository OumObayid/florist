import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  removeActiveUser,
  selectIsLoggedIn,
  selectUserInfoConnecter,
} from '../../ngrx/auth.slice';
import { CartslideComponent } from '../carts/cartslide/cartslide.component';
import {
  clearCartItems,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from '../../ngrx/carts.slice';
import { OrderSlideComponent } from '../orderslide/orderslide.component';
import { CartStateService } from '../../services/servicePartage/cart-state.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    CartslideComponent,
    OrderSlideComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  toggleCart() {
    throw new Error('Method not implemented.');
  }
  lastName: string | undefined = '';
  userRole: string | undefined = ''; // Stocker le rôle de l'utilisateur
  isCartOpen = false;
  isOrderOpen = false;
  cartCount: number = 0;
  cartTotal: number = 0;
  isloggedIn = false;
  cartItems: any = [];

  constructor(
    public router: Router,
    private store: Store,
    private cartState: CartStateService
  ) {}

  ngOnInit() {
    this.store.select(selectIsLoggedIn).subscribe((islog) => {
      this.isloggedIn = islog;
    });

    this.store.select(selectUserInfoConnecter).subscribe((user) => {
      this.lastName = user?.lastname || '';
      this.userRole = user?.role || '';
    });

    this.store.select(selectCartCount).subscribe((count) => {
      this.cartCount = count;
      console.log('this.cartCount :', this.cartCount);
    });
    this.store.select(selectCartItems).subscribe((items) => {
      this.cartItems = items;
    });
    this.store.select(selectCartTotal).subscribe((total) => {
      this.cartTotal = total;
    });
    this.cartState.cartOpen$.subscribe((open) => {
      this.isCartOpen = open;
    });
  }

  logout() {
    this.store.dispatch(removeActiveUser());
    this.store.dispatch(clearCartItems());
    localStorage.removeItem('items'); // supprime juste les items
    this.router.navigate(['/login']);
  }

  // toggleCartSlide(event: Event) {
  //   event.preventDefault();
  //   this.isCartOpen = !this.isCartOpen;
  // }
  toggleCartSlide(event: Event) {
  event.preventDefault();
  this.cartState.toggleCart(); // Utilise le service au lieu de changer directement isCartOpen
}

  openOrderSlide() {
    this.isCartOpen = false;
    this.isOrderOpen = true;
  }
  toggleOrderSlide(event: Event) {
    event.preventDefault();
    this.isOrderOpen = !this.isOrderOpen;
  }
}
