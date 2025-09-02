/**
 * CartStateService
 * ----------------
 * Service Angular centralisant l'état d'ouverture du panier (CartSlide).
 * 
 * Objectif :
 * - Permettre à plusieurs composants (Header, boutons d'ajout au panier, etc.)
 *   de partager et contrôler l'ouverture/fermeture du panier.
 * - Supprime la dépendance parent-enfant pour contrôler l'ouverture du slide.
 * - Garantit la synchronisation automatique de l'affichage du CartSlide 
 *   dans le Header et dans d'autres composants.
 * 
 * Fonctionnement :
 * - Utilise un BehaviorSubject<boolean> pour stocker l'état courant du panier :
 *     false = fermé, true = ouvert.
 * - Expose un Observable (cartOpen$) que les composants peuvent souscrire
 *   pour se mettre à jour automatiquement.
 * - Fournit des méthodes pour manipuler l'état :
 *     toggleCart() → inverse l'état actuel
 *     openCart()   → force l'ouverture
 *     closeCart()  → force la fermeture
 *
 * Exemple d'utilisation :
 * ----------------------
 * Dans un composant frère :
 *   this.cartState.openCart();   // ouvre le panier
 *   this.cartState.closeCart();  // ferme le panier
 * 
 * Dans HeaderComponent :
 *   this.cartState.cartOpen$.subscribe(open => {
 *     this.isCartOpen = open;    // synchronisation automatique
 *   });
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private cartOpenSubject = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpenSubject.asObservable();

  toggleCart() {
    this.cartOpenSubject.next(!this.cartOpenSubject.value);
  }

  openCart() {
    this.cartOpenSubject.next(true);
  }

  closeCart() {
    this.cartOpenSubject.next(false);
  }
}

