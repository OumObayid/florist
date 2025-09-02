/*
 * Projet Flower-Shop
 * Page : Détails Produit
 *
 * Description :
 * Composant Angular pour afficher les détails d'un produit.
 * - Récupère le produit courant et les produits liés de la même catégorie via le store NgRx.
 * - Permet d'ajouter un produit au panier avec gestion des alertes pour l'utilisateur non connecté.
 * - Gère l'état de chargement et les interactions avec le service de panier.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Product } from './../../interfaces/product';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { BannerTitleComponent } from '../../components/banner-title/banner-title.component';
import { ButtonComponent } from '../../components/button/button.component';
import { User } from '../../interfaces/user';
import { CartService } from '../../services/cart/cart.service';
import {
  selectIsLoggedIn,
  selectUserInfoConnecter,
} from '../../ngrx/auth.slice';
import { selectProducts } from '../../ngrx/data.slice';
import { setCartItems } from '../../ngrx/carts.slice';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { CartStateService } from '../../services/servicePartage/cart-state.service';
import { LinkButtonComponent } from "../../components/link-buton/link-buton.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BannerTitleComponent,
    ButtonComponent,
    AlertDialogComponent,
    LinkButtonComponent
  ],
  templateUrl: './productDetails.component.html',
  styleUrls: ['./productDetails.component.css'],
})
export class ProductDetailsComponent {
  product: Product | undefined; // Produit courant affiché
  relatedProducts: Product[] = []; // Produits de la même catégorie

  userInfoConnecter: User | null = null; // Info utilisateur connecté
  isloggedIn: boolean = false; // État de connexion
  productId!: number; // ID du produit courant
  userId!: string | null; // ID de l'utilisateur connecté
  isloading: boolean = false; // Indicateur de chargement pour l'ajout au panier

  showAlertAddToCart: boolean = false; // Affichage de l'alerte ajout panier
  showAlertConnexion: boolean = false; // Affichage de l'alerte connexion

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private cartState: CartStateService
  ) {}

  ngOnInit() {
    // Récupère l'ID du produit depuis les paramètres de l'URL
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convertir en number
      this.loadProduct(id);
    });

    // Abonnement pour récupérer l'utilisateur connecté
    this.store.select(selectUserInfoConnecter).subscribe((user) => {
      this.userId = user?.id != null ? String(user.id) : null;
    });

    // Abonnement pour vérifier si l'utilisateur est connecté
    this.store.select(selectIsLoggedIn).subscribe((islog) => {
      this.isloggedIn = islog || false;
    });
  }

  // Charge le produit courant et les produits liés
  loadProduct(id: number) {
    this.store
      .select(selectProducts)
      .pipe(
        map((products) =>
          products.find((p) => Number(p.id) === Number(id))
        )
      )
      .subscribe((prod) => {
        this.product = prod;

        // Charger les produits similaires après avoir trouvé le produit courant
        if (this.product?.categorie_id) {
          this.store
            .select(selectProducts)
            .pipe(
              map((products) =>
                products.filter(
                  (p) =>
                    p.categorie_id === this.product?.categorie_id &&
                    p.id !== this.productId
                )
              )
            )
            .subscribe((related) => {
              this.relatedProducts = related;
            });
        }
      });
  }

  // Gestion de l'ajout au panier
  handleAddToCart(product: Product): void {
    if (!this.userId) {
      this.showAlertConnexion = true;
      return;
    }

    this.isloading = true;

    this.cartService
      .addCartItem({
        userId: this.userId ?? '',
        productId: product.id,
        quantity: 1,
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            const data = { userId: (this.userId ?? '').toString() };
            this.cartService.getCartItems(data).subscribe({
              next: (response) => {
                if (response.success) {
                  const items = response.items;
                  this.store.dispatch(setCartItems({ items: items }));
                  this.showAlertAddToCart = true;
                }
              },
              error: (error) => {
                console.error("Erreur lors de l'ajout au panier:", error);
              },
            });
          }
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout au panier:", error);
        },
        complete: () => {
          this.isloading = false;
        },
      });
  }

  // Gestion de l'alerte ajout au panier
  handleAlertToCart(result: boolean) {
    if (result) {
      this.cartState.openCart();
    } else {
      console.log('Continuer les achats');
    }
  }

  // Gestion de l'alerte connexion
  handleAlertToConnect(result: boolean) {
    if (result) {
      this.router.navigate(['/login']);
    } else {
      console.log('annuler la connexion');
    }
  }
}
