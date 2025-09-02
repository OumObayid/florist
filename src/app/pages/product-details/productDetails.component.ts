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
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private cartState: CartStateService
  ) {}

  product: Product | undefined;
  relatedProducts: Product[] = []; // ← produits de la même catégorie

  userInfoConnecter: User | null = null;
  isloggedIn: boolean = false;
  productId!: number;
  userId!: string | null;
  isloading: boolean = false;

  showAlertAddToCart: boolean = false;
  showAlertConnexion: boolean = false;

  ngOnInit() {
    // const idParam = this.route.snapshot.paramMap.get('id');    
    // this.productId = idParam ? Number(idParam) : 0;

      this.route.params.subscribe(params => {
    const id = +params['id']; // convertir en number
    this.loadProduct(id);
  });


    this.store.select(selectUserInfoConnecter).subscribe((user) => {
      this.userId = user?.id != null ? String(user.id) : null;
    });
    this.store.select(selectIsLoggedIn).subscribe((islog) => {
      this.isloggedIn = islog || false;
    });
  
  }

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

        // ⚡ Charger les produits similaires après avoir trouvé le produit courant
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

  handleAlertToCart(result: boolean) {
    if (result) {
      this.cartState.openCart();
    } else {
      console.log('Continuer les achats');
    }
  }

  handleAlertToConnect(result: boolean) {
    if (result) {
      this.router.navigate(['/login']);
    } else {
      console.log('annuler la connexion');
    }
  }
}
