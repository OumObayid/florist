/*
 * Projet Flower-Shop
 * Page : Détails Catégorie
 *
 * Description :
 * Affiche les détails d'une catégorie spécifique ainsi que la liste des produits associés.
 * Récupère les informations de la catégorie et des produits depuis le store NgRx via des sélecteurs.
 * Utilise ActivatedRoute pour obtenir l'ID de la catégorie depuis l'URL.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { LinkButtonComponent } from './../../components/link-buton/link-buton.component';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Categorie } from '../../interfaces/categorie';
import { Product } from '../../interfaces/product';
import { selectCategories, selectProducts } from '../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";

@Component({
  selector: 'app-categorie-details',
  imports: [CommonModule, FormsModule, RouterLink, BannerTitleComponent, LinkButtonComponent],
  templateUrl: './categorie-details.component.html',
  styleUrls: ['./categorie-details.component.css'],
  standalone: true,
})
export class CategorieDetailsComponent {
  categorie: Categorie | undefined;
  id: number | null = null;
  products: Product[] = [];

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupérer l'ID de la catégorie depuis l'URL
    this.id = +this.route.snapshot.paramMap.get('id')!;

    // Sélectionner la catégorie correspondante depuis le store
    this.store
      .select(selectCategories)
      .pipe(
        map((categories) =>
          categories.find((c) => Number(c.id) === Number(this.id))
        )
      )
      .subscribe((cat) => {
        this.categorie = cat;
      });

    // Sélectionner les produits de cette catégorie depuis le store
    this.store
      .select(selectProducts)
      .pipe(
        map((products) =>
          products.filter((p) => Number(p.categorie_id) === Number(this.id))
        )
      )
      .subscribe((filteredProducts) => {
        this.products = filteredProducts;
      });
  }
}
