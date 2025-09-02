/*
 * Projet Flower-Shop
 * Page : Dashboard Utilisateur - Logique
 *
 * Description :
 * Gère le tableau de bord utilisateur :
 *  - Récupère les informations de l’utilisateur connecté depuis le store
 *  - Charge les éléments du panier et les commandes
 *  - Fournit des méthodes utilitaires pour calculer les totaux du panier et des commandes
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
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { User } from '../../../interfaces/user';
import { Store } from '@ngrx/store';
import { selectUserInfoConnecter } from '../../../ngrx/auth.slice';
import { Observable } from 'rxjs';
import { selectCartItems } from '../../../ngrx/carts.slice';
import { selectOrders } from '../../../ngrx/orders.slice';

@Component({
  imports: [CommonModule, TemplateDashboardComponent],
  selector: 'app-dashboard-user',
  templateUrl: './dashboardUser.component.html',
  styleUrls: ['./dashboardUser.component.css'],
})
export class DashboardUserComponent {
  // Flux d’éléments du panier
  cartItems$: Observable<any[]>;

  // Flux des commandes de l’utilisateur
  orders$: Observable<any[]>;

  // Flux des informations de l’utilisateur connecté
  userInfo$: Observable<any>;

  // Injection du store pour accéder aux sélecteurs NgRx
  constructor(private store: Store) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.orders$ = this.store.select(selectOrders);
    this.userInfo$ = this.store.select(selectUserInfoConnecter);
  }

  // Calcule le total du panier (prix * quantité)
  getCartTotal(cartItems: any[]): number {
    return cartItems?.reduce((sum, item) => sum + item.prix * item.quantity, 0) || 0;
  }

  // Calcule le total de toutes les commandes passées
  getOrdersTotal(orders: any[]): number {
    return orders.reduce(
      (sum, o) => sum + (parseFloat(o.total) || 0),
      0
    );
  }
}
