import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BannerTitleComponent } from "../../../components/banner-title/banner-title.component";
import { ButtonComponent } from "../../../components/button/button.component";
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, BannerTitleComponent, ButtonComponent],
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
isloading:boolean=false;
  constructor(
      private authService: AuthService,
      public router: Router,
      private store: Store
    ) {}

    onRegister(form: NgForm) {
       if (!form.valid) {
    this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }
      this.isloading=true;
      const data={
        firstname:this.firstname, 
        lastname:this.lastname, 
        email:this.email, 
        password:this.password, 
        phone:this.phone
      }
      this.authService
      .register(data)
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
          complete: ()=> {
            this.isloading=false;
          },
        });
    }
}
