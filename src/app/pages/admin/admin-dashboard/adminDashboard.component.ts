/*
 * Projet Flower-Shop
 * Page : Admin Dashboard
 *
 * Description :
 * Composant du tableau de bord administrateur.
 * Permet de consulter les statistiques globales : produits, utilisateurs, catégories et commandes.
 * Contient les observables pour récupérer les données du store NgRx et des méthodes utilitaires pour calculer les totaux et produits les plus achetés.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import {
  selectAllOrders,
  selectCategories,
  selectProducts,
  selectUsers,
} from '../../../ngrx/data.slice';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TemplateDashboardComponent],
  templateUrl: './adminDashboard.component.html',
  styleUrls: ['./adminDashboard.component.css'],
})
export class AdminDashboardComponent {
  // Observables pour récupérer les données depuis le store NgRx
  products$!: Observable<any[]>; // Produits
  users$!: Observable<any[]>; // Utilisateurs
  categories$!: Observable<any[]>; // Catégories
  orders$!: Observable<any[]>; // Commandes

  // Pourcentage de produits vendus par catégorie
  categoryPercentages: { name: string; sold: number; percent: number }[] = [];

  constructor(private store: Store) {
    // Initialisation des observables à partir du store
    this.products$ = this.store.select(selectProducts);
    this.users$ = this.store.select(selectUsers);
    this.categories$ = this.store.select(selectCategories);
    this.orders$ = this.store.select(selectAllOrders);
  }

  // Calcule le total des commandes
  getOrdersTotal(orders: any[] | undefined): number {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((sum, o) => {
      // parseFloat pour convertir le string en number
      const total = parseFloat(o.total);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);
  }

  // Retourne les produits les plus achetés, par défaut top 5
  getMostPurchasedProducts(orders: any[], topN = 5) {
    const productCount: Record<string, number> = {};

    // Comptabiliser la quantité vendue par produit
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (!productCount[item.product_nom]) productCount[item.product_nom] = 0;
        productCount[item.product_nom] += item.quantity;
      });
    });

    // Trier par quantité vendue et retourner les top N
    return Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([nom, quantity]) => ({ nom, quantity }));
  }
}
