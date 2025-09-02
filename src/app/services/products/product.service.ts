import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiURL}/products`; // URL de l'API PHP
  constructor(private http: HttpClient) {}

  //fetch all products
  getProducts(): Observable<any> {
    // Appel à l'API pour récupérer les produits
    return this.http.get(`${this.baseUrl}/getProducts.php`);
  }

  addProduct(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addProduct.php`, formData);
  }

  // Modifier un produit
  updateProduct(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateProduct.php`, formData);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/deleteProduct.php`, {
      body: { id },
    });
  }
}
