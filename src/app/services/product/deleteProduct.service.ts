import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteProductService {
  private baseUrl = `${environment.apiURL}/products/deleteProduct.php`;

  constructor(private http: HttpClient) {}


  deleteProduct(id: number) {
    return this.http.delete<{success:boolean;message:string}>(
        this.baseUrl,{ body: { id } } 
    );
  }
  
  
}
