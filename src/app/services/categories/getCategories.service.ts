import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCategoriesService {
  constructor(private http: HttpClient) { }
  
  private baseURL: string = environment.apiURL;

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseURL}/categories/getCategories.php`).pipe(
      tap(response => console.log('Réponse API :', response)), // Affiche bien la réponse
      catchError(error => {
        console.error('Erreur lors de la récupération des catégories', error);
        return throwError(() => new Error('Impossible de récupérer les catégories.'));
      })
    );
  }
}
