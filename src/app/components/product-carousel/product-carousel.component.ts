/*
 * Projet Flower-Shop
 * Page : Product Carousel
 *
 * Description :
 * Composant affichant un carrousel de produits récupérés depuis le store NgRx. 
 * Il gère l'état de chargement et intègre des boutons personnalisés pour naviguer 
 * vers les détails des produits ou vers d'autres pages via le composant LinkButton.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectProducts } from '../../ngrx/data.slice';
import { LinkButtonComponent } from "../link-buton/link-buton.component";

@Component({
  selector: 'app-product-carousel',
  imports: [CommonModule, RouterLink, LinkButtonComponent],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css',
})
export class ProductCarouselComponent {
  // Tableau des produits à afficher dans le carrousel
  products: Product[] | null = null;

  // Indicateur de chargement pour gérer l'affichage conditionnel
  loading: boolean = true;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Récupération des produits depuis le store NgRx
    this.store.select(selectProducts).subscribe((data) => {
      if (data.length > 0) {
        this.products = data;
        this.loading = false; // Les produits sont chargés
      }
    });
  }
}
