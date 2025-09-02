import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// EventEmitter permet d’envoyer des événements vers le parent
// Output permet d’exposer cet événement à l’extérieur du composant
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
  isLoading: boolean = false; // Indicateur pour afficher un état de chargement si nécessaire
  cartItems: CartItem[] = [];
  cartItems$!: Observable<CartItem[]>;
  userInfo$: Observable<User | null> | undefined; // Observable pour les informations utilisateur
  cartTotal: number = 0;

  //On déclare un événement nommé 'closeSlide' que le parent peut écouter
  @Output() closeSlide = new EventEmitter<void>();
  // Constructeur du composant
  constructor(private store: Store) {}

  ngOnInit(): void {
    // Récupérer l'observable des informations utilisateur depuis le store
    this.userInfo$ = this.store.select(selectUserInfoConnecter);
    // Récupérer les articles du panier
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartItems$.subscribe((items) => {
      this.cartItems = items;
      if (this.cartItems.length > 0) this.isLoading = false;
    });
    this.store.select(selectCartTotal).subscribe((total) => {
      this.cartTotal = total;
    });
  }

  handleCloseCart() {
     // fonction appelée lorsqu’on clique sur le bouton de fermeture
    this.closeSlide.emit(); 
    // émet l'événement vers le parent pour qu’il ferme le slide
  }
}
