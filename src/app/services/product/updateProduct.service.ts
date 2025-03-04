import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class UpdateProductsService {
  // private baseUrl=  environment.apiURL;
  private apiUrl = `${environment.apiURL}/products/updateProduct.php`; // URL de l'API PHP

  constructor(private http: HttpClient) {}

  // Modifier un produit
  updateProduct(product: Product): Observable<any> {
    const formData = new FormData();
    formData.append('id', String(product.id));
    formData.append('nom', product.nom);
    formData.append('description', product.description);
    formData.append('prix', String(product.prix));
    formData.append('categorie_id', product.categorie_id);

    // Vérifier si l'image est un fichier avant de l'ajouter
    if (product.image instanceof File) {
      formData.append('image', product.image);
    } else {
      console.warn('⚠️ Aucune image ajoutée !');
    }
    // Vérifier le contenu avant envoi
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    return this.http.post(this.apiUrl, formData);
  }
}
