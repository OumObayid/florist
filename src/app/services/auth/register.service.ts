import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl=  environment.apiURL;
  private apiUrl = `${this.baseUrl}/auth/register.php`; // URL de l'API PHP

  constructor(private http: HttpClient) {}

  register(firstname:string,lastname:string,email: string, password: string,phone:string): Observable<any> { //observable est un objet qui emet des valeurs et qui peut etre souscrit
    const body = {firstname,lastname, email, password,phone };
    return this.http.post<any>(this.apiUrl, body); // Envoi a travers http.post l'email et le mot de passe a l'API PHP et retourne la reponse
  }
}

