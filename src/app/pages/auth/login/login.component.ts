import { OrdersService } from './../../../services/orders/orders.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  getActiveUserInfo,
  setActiveUser,
  setUserRole,
} from '../../../ngrx/auth.slice';
import { BannerTitleComponent } from '../../../components/banner-title/banner-title.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { setCartItems } from '../../../ngrx/carts.slice';
import { setOrders } from '../../../ngrx/orders.slice';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BannerTitleComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  loading: boolean = false;
  
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private ordersService: OrdersService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // if (isLoggedIn) {
    //   this.router.navigate(['/dashboard']); // Rediriger l'utilisateur vers dashboard
    // }
  }

onLogin(form: NgForm) {
  if (!form.valid) {
    this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }

  this.loading = true;

  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      if (response.success && response.user) {
        // Enregistrer l'utilisateur dans le store et localStorage
        this.store.dispatch(setActiveUser());
        this.store.dispatch(getActiveUserInfo(response.user));
        this.store.dispatch(setUserRole(response.user.role));
        localStorage.setItem('user', JSON.stringify(response.user));

        // Récupérer et mettre à jour le panier dès la connexion
        this.cartService.getCartItems({ userId: response.user.id }).subscribe({
          next: (cartResponse: any) => {
            if (cartResponse.success && Array.isArray(cartResponse.items)) {
             // Mettre à jour le store et le localStorage
              this.store.dispatch(setCartItems({ items: cartResponse.items }));
              localStorage.setItem('cart', JSON.stringify(cartResponse.items));
            } else {
              console.error('Erreur: Format de données invalide!', cartResponse);
              this.store.dispatch(setCartItems({ items: [] }));
              localStorage.setItem('cart', JSON.stringify([]));
            }
          },
          error: (err) => {
            console.error('Erreur lors de la récupération du panier:', err);
            this.store.dispatch(setCartItems({ items: [] }));
            localStorage.setItem('cart', JSON.stringify([]));
          },
          
        });
        // Récupérer et mettre à jour le panier dès la connexion
        this.ordersService.getOrders(response.user.id).subscribe({
          next: (response: any) => {
            if (response.success && Array.isArray(response.orders)) {
            console.log('response.orders in login:', response.orders);
             // Mettre à jour le store et le localStorage
              this.store.dispatch(setOrders({ orders: response.orders }));
            } else {
              console.error('Erreur: Format de données invalide!', response);
              this.store.dispatch(setOrders({ orders: [] }));
            }
          },
          error: (err) => {
            console.error('Erreur lors de la récupération du panier:', err);
            this.store.dispatch(setCartItems({ items: [] }));
          },
          
        });

        // Rediriger selon le rôle
        if (response.user.role === 'user') {
          this.router.navigate(['/user']);
         
        } else if (response.user.role === 'admin') {
          this.router.navigate(['/admin']);
        }
      } else {
        this.errorMessage = response.error || "Erreur d'authentification";
      }
    },
    error: () => {
      this.errorMessage = 'Erreur de connexion au serveur';
    },
    complete: () => {
       
      this.loading = false;
    },
  });
}

}
