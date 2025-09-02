import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseURL = `${environment.apiURL}/categories`; // Remplace par ton URL
  constructor(private http: HttpClient) {}


  getCategories(): Observable<any> {
    try {
      // Appel à l'API pour récupérer les categories
      const response = this.http.get(`${this.baseURL}/getCategories.php`);
    
      return response;
    } catch (error) {
      // Gestion des erreurs : affiche un message dans la console
      console.error('Erreur lors de la récupération des categories', error);

      // Propage l'erreur pour qu'elle puisse être gérée par l'appelant
      throw error;
    }
  }

   addCategory(
      nom: string,
      description: string,
      image: File
    ): Observable<any> {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('description', description);
      formData.append('image', image); // Envoi de l'image en tant que fichier
  
      return this.http.post(`${this.baseURL}/addCategorie.php`, formData);
    }

updateCategory(categoryUpdated: any): Observable<any> {
  const formData = new FormData();

  formData.append('id', categoryUpdated.id.toString());
  formData.append('nom', categoryUpdated.nom);
  formData.append('description', categoryUpdated.description);

  if (categoryUpdated.image) {
    formData.append('image', categoryUpdated.image);
  }
  return this.http.post(`${this.baseURL}/updateCategorie.php`, formData);
}

  deleteCategory(id: number) : Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteCategorie.php`,{ body: { id:id } } 
    );
  }

}
