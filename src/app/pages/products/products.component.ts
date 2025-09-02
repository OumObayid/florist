/*
 * Projet Flower-Shop
 * Page : Composant Produits - Logique
 *
 * Description :
 * Gère l’affichage de la liste des produits :
 *  - Récupère les produits depuis le store NgRx
 *  - Met à jour l’état local (products, loading)
 *  - Utilise des composants enfants pour l’affichage (bannière, boutons, etc.)
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProducts } from '../../ngrx/data.slice';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";
import { LinkButtonComponent } from "../../components/link-buton/link-buton.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BannerTitleComponent, LinkButtonComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  // Liste des produits à afficher
  products: Product[] = [];

  // Indicateur de chargement (true par défaut avant la récupération des données)
  loading: boolean = true;

  // Injection du store NgRx pour accéder aux produits
  constructor(private store: Store) {}

  // Au chargement du composant : souscription aux produits du store
  ngOnInit(): void {
    this.store.select(selectProducts).subscribe(data => {
      if (data.length > 0) {
        // Mise à jour de la liste des produits
        this.products = data;
        // Désactivation de l’état "chargement"
        this.loading = false;
      }
    });
  }
}
