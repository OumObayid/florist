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
import {  ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-orders',
  imports: [TemplateDashboardComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './adminOrders.component.html',
  styleUrl: './adminOrders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  orders$!: Observable<Order[]>;

  statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  // dictionnaire indexé par id de commande
  selectedStatus: { [id: number]: string } = {};

  constructor(
    private store: Store, 
    private ordersService: OrdersService,
    private toastr : ToastrService
) {}

  ngOnInit(): void {
    // d’abord assigner
    this.orders$ = this.store.select(selectAllOrders);

    // puis optionnellement s’abonner
    this.orders$.subscribe((orders) => {
      console.log('Orders from: admin', orders);
      orders.forEach((order) => {
        // Si pas déjà défini, prendre la valeur actuelle de l'order
        if (!this.selectedStatus[order.id!]) {
          this.selectedStatus[order.id!] = order.status;
        }
      });
    });
  }


updateStatus(orderId: number, newStatus: "pending" | "paid" | "shipped" | "delivered" | "cancelled") {
  this.ordersService.updateOrderStatus(orderId, newStatus).subscribe({
    next: (response) => {
      console.log('response :', response);
      if (response.success) {
        this.toastr.success("Statut mis à jour");

        // ⚡ Dispatch vers le store pour mettre à jour le statut localement
        this.store.dispatch(updateStatusOrder(orderId, newStatus));

      }
    },
    error: (err) => console.error(err),
  });
}
}
