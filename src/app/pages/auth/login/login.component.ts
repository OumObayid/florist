import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from '../../../services/auth/login.service';
import { getActiveUserInfo, setActiveUser, setUserRole } from '../../../ngrx/data.slice';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    private loginService: LoginService,
    public router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // if (isLoggedIn) {
    //   this.router.navigate(['/dashboard']); // Rediriger l'utilisateur vers dashboard
    // }
  }

  onLogin() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          // Enregistrer l'utilisateur dans le store et localStorage
          this.store.dispatch(setActiveUser());
          this.store.dispatch(getActiveUserInfo(response.user));
          this.store.dispatch(setUserRole(response.user.role)); 

          localStorage.setItem('user', JSON.stringify(response.user));
  
          console.log('response.user.role :', response.user.role);
          
          // Rediriger en fonction du rôle de l'utilisateur
          if (response.user.role === 'user') {
            this.router.navigate(['/dashboard']); // Rediriger vers le dashboard de l'utilisateur
          } else if (response.user.role === 'admin') {
            this.router.navigate(['/admin']); // Rediriger vers le dashboard admin
          }
        } else {
          this.errorMessage = response.error || 'Erreur d\'authentification';
        }
      },
      error: () => {
        this.errorMessage = 'Erreur de connexion au serveur';
      },
    });
  }
  
}
