import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteCategoryService {
  private baseUrl = `${environment.apiURL}/categories/deleteCategorie.php`;

  constructor(private http: HttpClient) {}


  deleteCategory(id: number) {
    return this.http.delete<{success:boolean;message:string}>(
        this.baseUrl,{ body: { id } } 
    );
  }
  
  
}
