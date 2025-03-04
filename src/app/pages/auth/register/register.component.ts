import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../../services/auth/register.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
      private registerService: RegisterService,
      public router: Router,
      private store: Store
    ) {}

    onRegister() {
      this.registerService
        .register(this.firstname, this.lastname, this.email, this.password, this.phone)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.successMessage = 'Inscription réussie ! Redirection en cours...';
              setTimeout(() => this.router.navigate(['/login']), 2000);
            } else {
              this.errorMessage = response.message || 'Erreur lors de l\'inscription';
            }
          },
          error: () => {
            this.errorMessage = 'Erreur de connexion au serveur';
          },
        });
    }
}
