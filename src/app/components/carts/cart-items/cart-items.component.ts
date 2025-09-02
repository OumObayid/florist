import { ConfirmDialogComponent } from './../../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../interfaces/cartItem';
import { CartService } from '../../../services/cart/cart.service';
import {
  removeCartItem,
  updateCartItemQuantity,
} from '../../../ngrx/carts.slice';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  standalone: true, // Ajout de standalone si vous utilisez Angular 14+
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit {
  @Input() cartItem!: CartItem;

  totalItemPrice: number = 0;
  constructor(
    private dialog: MatDialog,
    private cartService: CartService,
    private store: Store
  ) {}
  ngOnInit(): void {
    this.updateTotal();
  }

  incrementQuantity() {
    this.cartItem = { ...this.cartItem, quantity: this.cartItem.quantity + 1 };
    this.updateTotal();

    const data = {
      itemId: this.cartItem.id,
      quantity: this.cartItem.quantity,
    };

    // Appel au service avec Observable
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
        // En cas d'erreur, afficher un message dans la console
        console.error(error);
      },
    });
  }

  decrementQuantity() {
    if (this.cartItem.quantity > 1) {
      // Sur la page
      this.cartItem = {
        ...this.cartItem,
        quantity: this.cartItem.quantity - 1,
      };
      this.updateTotal();

      const data = {
        itemId: this.cartItem.id,
        quantity: this.cartItem.quantity,
      };

      // Appel au service avec Observable
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
          // En cas d'erreur, afficher un message dans la console
          console.error(error);
        },
      });

      // Sur la BD et NGRX
    }
  }

  updateTotal() {
    this.totalItemPrice = this.cartItem.quantity * this.cartItem.prix;
  }

  onRemoveItem() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
       panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = { itemId: this.cartItem.id };
        // Appel via HttpClient Observable
        this.cartService.deleteFromCart(data).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.store.dispatch(removeCartItem(data));
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
        console.log('Action annulée');
      }
    });
  }

  // });
  // Ajoutez ici votre logique pour supprimer l'article
}
