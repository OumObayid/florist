import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { getCategories, selectCategories, selectProducts } from '../../../ngrx/data.slice';
import { map } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { ProductsService } from '../../../services/product/products.service';
import { Categorie } from '../../../interfaces/categorie';
import { UpdateCategoryService } from '../../../services/categories/updateCategory.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css'],
})
export class UpdateCategoryComponent implements OnInit {
    id: number | null = null;
    nom: string = '';
    categories: Categorie[] = [];
  
    constructor(
      private store: Store,
      private route: ActivatedRoute,
      private updateCategoryService: UpdateCategoryService
    ) {}
  
    ngOnInit() {
      // Récupérer les catégories depuis le store
      this.store.select(selectCategories).subscribe((categories) => {
        this.categories = categories;
      });
  
      // Récupérer l'ID de la catégorie depuis l'URL
      this.route.params.subscribe((params) => {
        this.id = +params['id']; // Convertir en nombre
  
        // Trouver la catégorie correspondante
        const category = this.categories.find(cat => cat.id === this.id);
        if (category) {
          this.nom = category.nom;
        }
      });
    }
  
    updateCategory() {
      if (!this.id || !this.nom.trim()) {
        alert("Tous les champs sont requis !");
        return;
      }
  
      this.updateCategoryService.updateCategory(this.id, this.nom).subscribe({
        next: (response) => {
          if (response.success) {
            alert("Catégorie mise à jour avec succès !");
            
            // Mise à jour du store
            this.store.dispatch(getCategories(
              this.categories.map(cat => cat.id === this.id ? { ...cat, nom: this.nom } : cat)
            ));
          } else {
            alert("Erreur: " + response.message);
          }
        },
        error: (err) => {
          console.error("Erreur API", err);
          alert("Erreur lors de la mise à jour de la catégorie.");
        }
      });
    }
  
    cancelEdit() {
      window.history.back();
    }
  
}
