import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserService {
  private baseUrl = `${environment.apiURL}/users/deleteUser.php`;

  constructor(private http: HttpClient) {}


  deleteUser(id: number) {
    return this.http.delete<{success:boolean;message:string}>(
        this.baseUrl,{ body: { id } } 
    );
  }
  
  
}
