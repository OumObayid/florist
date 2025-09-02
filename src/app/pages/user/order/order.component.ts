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
isloading:boolean=false;
  constructor(private store: Store) {}

  ngOnInit() {
    this.orders$ = this.store
      .select(selectOrders)
      .pipe(map((orders) => orders.filter((o) => o !== null)));
    // 🔹 debug: voir ce que contient le store
    this.orders$.subscribe((orders) => {
      console.log('Orders from store:', orders);
    });
  }

}
