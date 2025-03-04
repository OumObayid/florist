import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateCategoryService {
  private apiUrl = `${environment.apiURL}/categories/updateCategorie.php`; 

  constructor(private http: HttpClient) {}

  updateCategory(id: number, nom: string): Observable<any> {
    return this.http.put(this.apiUrl, { id, nom }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
