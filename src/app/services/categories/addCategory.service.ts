import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddCategoryService {
  private apiUrl = `${environment.apiURL}/categories/addCategorie.php`; // Remplace par ton URL

  constructor(private http: HttpClient) {}

  addCategory(name: string): Observable<any> {
    return this.http.post(this.apiUrl, { nom: name }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
