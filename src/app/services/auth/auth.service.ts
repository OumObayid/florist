import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiURL;
  private apiUrl = `${this.baseUrl}/auth`; // URL de l'API PHP

  //connexion
  login(email: string, password: string): Observable<any> {
    //observable est un objet qui emet des valeurs et qui peut etre souscrit
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login.php`, body); // Envoi a travers http.post l'email et le mot de passe a l'API PHP et retourne la reponse
  }

  //inscription
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register.php`, data);
  }

  updatePassword(
    userId: number,

    oldPassword: string,

    newPassword: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/updatePassword.php`, {
      userId,
      oldPassword,
      newPassword,
    });
  }
}
