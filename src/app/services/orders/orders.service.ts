import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id?: number;
  user_id: number;
  total?: number;
  payment_mode: string;
  status?: string;
  items: OrderItem[];
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = `${environment.apiURL}/orders`; // URL de l'API PHP

  constructor(private http: HttpClient) {}

  /** Créer une commande */
  createOrder(order: Order): Observable<any> {
    return this.http.post(`${this.baseUrl}/createOrder.php`, order);
  }
  // ??????????????????? attention il envoyer data en post pas en get
  /** Lister toutes les commandes d’un utilisateur */
  getOrders(userId: number): Observable<Order[]> {
    return this.http.post<Order[]>(
      `${this.baseUrl}/getOrders.php`,
      { user_id: userId } // body envoyé en POST
    );
  }
    // Lister toutes les commandes 
getAllOrders(): Observable<any> {
  return this.http.get<Order[]>(`${this.baseUrl}/getAllOrders.php`);
}

  /** Obtenir une commande spécifique */
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/getOrder.php?id=${orderId}`);
  }

  /** Mettre à jour le statut d’une commande */
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateOrderStatus.php`, {
      id: orderId,
      status,
    });
  }
}
