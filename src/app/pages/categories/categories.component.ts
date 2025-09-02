/*
 * Projet Flower-Shop
 * Page : Liste des Catégories
 *
 * Description :
 * Affiche toutes les catégories disponibles dans la boutique.
 * Récupère les catégories depuis le store NgRx et les stocke localement pour l'affichage.
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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categorie } from '../../interfaces/categorie';
import { selectCategories } from '../../ngrx/data.slice';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";
import { LinkButtonComponent } from "../../components/link-buton/link-buton.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BannerTitleComponent, LinkButtonComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  // Tableau pour stocker toutes les catégories
  categories: Categorie[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Souscrire au store pour récupérer les catégories et les stocker localement
    this.store.select(selectCategories).subscribe(data => { 
        this.categories = data;     
    });
  }
}
