import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  private apiUrl = `${environment.apiURL}/products/addProduct.php`; // Remplace par ton URL

  constructor(private http: HttpClient) {}

  addProduct(
    nom: string,
    description: string,
    prix: number,
    categorie_id: string,
    image: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix', prix.toString());
    formData.append('categorie_id', categorie_id);
    formData.append('image', image); // Envoi de l'image en tant que fichier

    return this.http.post(this.apiUrl, formData);
  }
}
