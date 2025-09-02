/*
 * Projet Flower-Shop
 * Page : Panier glissant (Cart Slide)
 *
 * Description :
 * Composant affichant le panier sous forme de slide avec les articles,
 * le total du panier et les informations utilisateur. Permet de fermer
 * le slide via un événement émis vers le parent.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// EventEmitter : permet d’envoyer des événements vers le parent
// Output : permet d’exposer cet événement à l’extérieur du composant
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CartItem } from '../../../interfaces/cartItem';
import { CommonModule } from '@angular/common';
import { User } from '../../../interfaces/user';
import { CartItemsComponent } from '../cart-items/cart-items.component';
import { selectUserInfoConnecter } from '../../../ngrx/auth.slice';
import { selectCartItems, selectCartTotal } from '../../../ngrx/carts.slice';
import { LinkButtonComponent } from '../../link-buton/link-buton.component';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule, CartItemsComponent, LinkButtonComponent],
  templateUrl: './cartslide.component.html',
  styleUrls: ['./cartslide.component.css'], // Correction : "styleUrls" avec un "s"
})
export class CartslideComponent implements OnInit {
  // Indicateur de chargement
  isLoading: boolean = false;

  // Tableau des articles présents dans le panier
  cartItems: CartItem[] = [];

  // Observable pour récupérer les articles du panier depuis le store
  cartItems$!: Observable<CartItem[]>;

  // Observable pour récupérer les informations utilisateur
  userInfo$: Observable<User | null> | undefined;

  // Total du panier
  cartTotal: number = 0;

  // Événement émis pour fermer le slide, que le parent peut écouter
  @Output() closeSlide = new EventEmitter<void>();

  // Constructeur : injection du store NGRX
  constructor(private store: Store) {}

  ngOnInit(): void {
    // Récupération des informations utilisateur depuis le store
    this.userInfo$ = this.store.select(selectUserInfoConnecter);

    // Récupération des articles du panier depuis le store
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartItems$.subscribe((items) => {
      this.cartItems = items;
      if (this.cartItems.length > 0) this.isLoading = false;
    });

    // Récupération du total du panier depuis le store
    this.store.select(selectCartTotal).subscribe((total) => {
      this.cartTotal = total;
    });
  }

  // Fonction appelée lors de la fermeture du slide
  handleCloseCart() {
    // Émet l'événement vers le parent pour fermer le slide
    this.closeSlide.emit(); 
  }
}
