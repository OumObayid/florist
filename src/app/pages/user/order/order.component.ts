/*
 * Projet Flower-Shop
 * Page : Orders - Composant
 *
 * Description :
 * - Affiche la liste des commandes de l’utilisateur
 * - Récupère les données depuis le store NgRx (orders.slice)
 * - Utilise TemplateDashboardComponent pour la mise en page
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { map, Observable } from 'rxjs';
import { Order } from '../../../interfaces/order';
import { selectOrders } from '../../../ngrx/orders.slice';
import { RouterLink } from '@angular/router';
import { LinkButtonComponent } from "../../../components/link-buton/link-buton.component";

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [TemplateDashboardComponent, CommonModule, RouterLink, LinkButtonComponent],
})
export class OrderComponent {
  orders$!: Observable<Order[]>;
  isloading: boolean = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.orders$ = this.store
      .select(selectOrders)
      .pipe(map((orders) => orders.filter((o) => o !== null)));

    // 🔹 Debug : affiche les données dans la console
    this.orders$.subscribe((orders) => {
      console.log('Orders from store:', orders);
    });
  }
}
