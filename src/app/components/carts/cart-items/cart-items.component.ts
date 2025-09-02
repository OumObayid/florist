/*
 * Projet Flower-Shop
 * Page : Article du panier (Cart Item)
 *
 * Description :
 * Composant représentant un seul article du panier. 
 * Permet d’afficher les informations de l’article, de modifier sa quantité 
 * et de le supprimer via une boîte de dialogue de confirmation.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { ConfirmDialogComponent } from './../../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../interfaces/cartItem';
import { CartService } from '../../../services/cart/cart.service';
import { removeCartItem, updateCartItemQuantity } from '../../../ngrx/carts.slice';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  standalone: true, // Composant autonome Angular 14+
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit {
  // Article du panier passé depuis le composant parent
  @Input() cartItem!: CartItem;

  // Prix total pour cet article (quantité * prix unitaire)
  totalItemPrice: number = 0;

  constructor(
    private dialog: MatDialog,       // Service pour ouvrir des dialogues
    private cartService: CartService, // Service pour gérer le panier via HTTP
    private store: Store              // Store NGRX pour gérer l'état du panier
  ) {}

  ngOnInit(): void {
    // Calcul initial du prix total
    this.updateTotal();
  }

  // Incrémente la quantité de l'article
  incrementQuantity() {
    this.cartItem = { ...this.cartItem, quantity: this.cartItem.quantity + 1 };
    this.updateTotal();

    const data = {
      itemId: this.cartItem.id,
      quantity: this.cartItem.quantity,
    };

    // Appel au service pour mettre à jour la quantité sur le serveur
    this.cartService.updateCartQuantity(data).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Mise à jour du store NGRX
          this.store.dispatch(
            updateCartItemQuantity({
              itemId: this.cartItem.id,
              quantity: this.cartItem.quantity,
            })
          );
        }
      },
      error: (error) => {
        // En cas d'erreur HTTP, afficher dans la console
        console.error(error);
      },
    });
  }

  // Décrémente la quantité de l'article (minimum 1)
  decrementQuantity() {
    if (this.cartItem.quantity > 1) {
      this.cartItem = { ...this.cartItem, quantity: this.cartItem.quantity - 1 };
      this.updateTotal();

      const data = {
        itemId: this.cartItem.id,
        quantity: this.cartItem.quantity,
      };

      // Appel au service pour mettre à jour la quantité sur le serveur
      this.cartService.updateCartQuantity(data).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.store.dispatch(
              updateCartItemQuantity({
                itemId: this.cartItem.id,
                quantity: this.cartItem.quantity,
              })
            );
          }
        },
        error: (error) => {
          console.error(error); // En cas d'erreur HTTP
        },
      });
    }
  }

  // Met à jour le prix total pour cet article
  updateTotal() {
    this.totalItemPrice = this.cartItem.quantity * this.cartItem.prix;
  }

  // Supprime l'article du panier après confirmation
  onRemoveItem() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    // Gestion de la réponse de la boîte de dialogue
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = { itemId: this.cartItem.id };

        // Appel au service pour supprimer l'article du panier
        this.cartService.deleteFromCart(data).subscribe({
          next: (response: any) => {
            if (response.success) {
              // Mise à jour du store NGRX
              this.store.dispatch(removeCartItem(data));
              // Optionnel : afficher une notification de succès
              // this.toastr.success('Article supprimé avec succès');
            } else {
              console.error(response.message);
            }
          },
          error: (error) => {
            console.error(error); // En cas d'erreur HTTP
          },
        });
      } else {
        // Action annulée par l'utilisateur
        console.log('Action annulée');
      }
    });
  }

}
