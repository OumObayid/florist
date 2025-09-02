import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = `${environment.apiURL}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUsers.php`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/deleteUser.php`, { body: { id } });
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateUserRole.php`, { id, role });
  }

  updateUserInfos(data: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address:string
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateUserInfos.php`, data);
  }

   // 🔹 Mise à jour de l'adresse utilisateur
  updateUserAddress(userId: number, address: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/updateUserAddress.php`, {userId,address });
  }
}
