/*
 * Projet Flower-Shop
 * Page : Admin Orders
 *
 * Description :
 * Composant de gestion des commandes pour l’administrateur.
 * Permet de consulter toutes les commandes, de voir leur statut et de le mettre à jour.
 * Utilise les observables du store NgRx pour récupérer les commandes et dispatch pour mettre à jour le statut.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { OrdersService } from './../../../services/orders/orders.service';
import { Component, OnInit } from '@angular/core';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Order } from '../../../interfaces/order';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllOrders, updateStatusOrder } from '../../../ngrx/data.slice';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-orders',
  imports: [TemplateDashboardComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './adminOrders.component.html',
  styleUrl: './adminOrders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  // Observable des commandes depuis le store
  orders$!: Observable<Order[]>;

  // Options possibles pour le statut d'une commande
  statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  // Dictionnaire pour stocker le statut sélectionné par commande, indexé par l'id
  selectedStatus: { [id: number]: string } = {};

  constructor(
    private store: Store,
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Assignation de l'observable orders$ depuis le store
    this.orders$ = this.store.select(selectAllOrders);

    // Abonnement pour initialiser le statut sélectionné de chaque commande
    this.orders$.subscribe((orders) => {
      console.log('Orders from: admin', orders);
      orders.forEach((order) => {
        // Si le statut n'est pas déjà défini, prendre la valeur actuelle de l'order
        if (!this.selectedStatus[order.id!]) {
          this.selectedStatus[order.id!] = order.status;
        }
      });
    });
  }

  /**
   * Met à jour le statut d'une commande
   * @param orderId ID de la commande
   * @param newStatus Nouveau statut à appliquer
   */
  updateStatus(
    orderId: number,
    newStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  ) {
    this.ordersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        console.log('response :', response);
        if (response.success) {
          // Notification succès
          this.toastr.success('Statut mis à jour');

          // Dispatch vers le store pour mettre à jour le statut localement
          this.store.dispatch(updateStatusOrder(orderId, newStatus));
        }
      },
      error: (err) => console.error(err),
    });
  }
}
