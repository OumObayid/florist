import { environment } from '../../../environments/environment';
// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = environment.apiURL;
  private apiUrl = `${this.baseUrl}/carts`;

  constructor(private http: HttpClient) {}

    // Ajouter un produit
  addCartItem(item:{
    userId: string;
    productId: number;
    quantity: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/addCart.php`, item);
  }

   // Récupérer tous les articles du panier
  getCartItems(data: { userId:string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/getCartItems.php`, data);
  }

  // Mettre à jour la quantité d’un produit
  updateCartQuantity(data: { itemId: number; quantity: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateCard.php`, data);
  }

  // Supprimer un produit
  deleteFromCart(data: { itemId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteCart.php`, data);
  }

 
}
