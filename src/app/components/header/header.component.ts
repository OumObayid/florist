/*
 * Projet Flower-Shop
 * Page : Header
 *
 * Description :
 * Composant affichant l'en-tête du site avec navigation, gestion du panier et des commandes.
 * Permet de suivre l'état de connexion de l'utilisateur, l'ouverture du panier, le nombre
 * d'articles dans le panier et le total du panier.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

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

  // Informations utilisateur
  lastName: string | undefined = '';
  userRole: string | undefined = ''; 

  // État des slides et du panier
  isCartOpen = false;
  isOrderOpen = false;

  // Informations du panier
  cartCount: number = 0;
  cartTotal: number = 0;
  cartItems: any = [];

  // État de connexion de l'utilisateur
  isloggedIn = false;

  constructor(
    public router: Router,
    private store: Store,
    private cartState: CartStateService
  ) {}

  ngOnInit() {
    // Souscrire à l'état de connexion
    this.store.select(selectIsLoggedIn).subscribe((islog) => {
      this.isloggedIn = islog;
    });

    // Récupérer les informations de l'utilisateur connecté
    this.store.select(selectUserInfoConnecter).subscribe((user) => {
      this.lastName = user?.lastname || '';
      console.log('user :', user);
     
      this.userRole = user?.role || '';
    });

    // Suivi du nombre d'articles dans le panier
    this.store.select(selectCartCount).subscribe((count) => {
      this.cartCount = count;
      console.log('this.cartCount :', this.cartCount);
    });

    // Suivi des articles dans le panier
    this.store.select(selectCartItems).subscribe((items) => {
      this.cartItems = items;
    });

    // Suivi du total du panier
    this.store.select(selectCartTotal).subscribe((total) => {
      this.cartTotal = total;
    });

    // Suivi de l'ouverture du panier via le service
    this.cartState.cartOpen$.subscribe((open) => {
      this.isCartOpen = open;
    });
  }

  // Déconnexion de l'utilisateur
  logout() {
    this.store.dispatch(removeActiveUser());
    this.store.dispatch(clearCartItems());
    localStorage.removeItem('items'); // Supprime uniquement les items du panier
    this.router.navigate(['/login']);
  }

  // Toggle du slide du panier via le service partagé
  toggleCartSlide(event: Event) {
    event.preventDefault();
    this.cartState.toggleCart(); // Utilise le service au lieu de changer directement isCartOpen
  }

  // Ouvre le slide des commandes et ferme celui du panier
  openOrderSlide() {
    this.isCartOpen = false;
    this.isOrderOpen = true;
  }

  // Toggle du slide des commandes
  toggleOrderSlide(event: Event) {
    event.preventDefault();
    this.isOrderOpen = !this.isOrderOpen;
  }

  // Méthode temporaire non implémentée
  toggleCart() {
    throw new Error('Method not implemented.');
  }
}
