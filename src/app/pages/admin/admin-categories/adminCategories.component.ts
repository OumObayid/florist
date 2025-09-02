/*
 * Projet Flower-Shop
 * Page : Admin - Gestion des catégories
 *
 * Description :
 * Composant Angular pour gérer les catégories de produits dans le back-office.
 * Permet d'ajouter, supprimer, visualiser les catégories et gérer l'aperçu des images.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Categorie } from '../../../interfaces/categorie';
import {
  addCategory,
  deleteCategory,
  selectCategories,
} from '../../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { CategoriesService } from '../../../services/categories/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { LinkButtonComponent } from "../../../components/link-buton/link-buton.component";

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TemplateDashboardComponent,
    ButtonComponent,
    LinkButtonComponent
],
  templateUrl: './adminCategories.component.html',
  styleUrls: ['./adminCategories.component.css'],
})
export class AdminCategoriesComponent implements OnInit {
  // Champs du formulaire d'ajout / édition
  categorie_id: string = '';
  nom: string = '';
  description: string = '';
  image: File | null = null;

  selectedFile: File | null = null; // Pour la sélection d'image
  imagePreview: string | null = null; // Aperçu de l'image sélectionnée

  categories: Categorie[] = []; // Liste des catégories

  loadingButtonsList: { [id: number]: boolean } = {}; // Indicateurs de chargement pour chaque bouton supprimer
  loading: boolean = false; // Indicateur global pour ajout de catégorie
  loading2: boolean = false; // Indicateur de chargement initial des catégories

  successMessage: string = ''; // Message succès
  errorMessage: string = ''; // Message d'erreur

  constructor(
    public store: Store,
    private categoryService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 🔹 Chargement initial : activer le spinner
    this.loading2 = true;
    // 🔹 Récupération des catégories depuis le store NgRx
    this.store.select(selectCategories).subscribe((dataCat) => {
      this.categories = dataCat || [];
      if (this.categories.length > 0) this.loading2 = false; // Désactiver spinner si données présentes
    });
  }

  // Méthode réutilisable pour recharger les catégories depuis le store
  loadCategories(): void {
    this.store.select(selectCategories).subscribe((dataCat) => {
      this.categories = dataCat || [];
    });
  }

  // Gestion de la sélection de fichier image
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0]; // Stocker l'image sélectionnée

      // 🔹 Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  // Ajout d'une nouvelle catégorie
  addCategorie(): void {
    this.successMessage = '';
    this.errorMessage = '';
    // Vérifier que tous les champs sont remplis
    if (this.nom && this.description && this.image) {
      this.loading = true;
      this.categoryService
        .addCategory(this.nom, this.description, this.image)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.successMessage = 'Categorie a été ajouté avec success';
              this.store.dispatch(response.category); // Mettre à jour le store
            } else {
              this.errorMessage = response.message || "Erreur lors de l'ajout";
            }
          },
          error: (err) => {
            console.error('Erreur API', err);
            this.errorMessage = "Erreur lors de l'ajout de la catégorie.";
          },
          complete: () => {
            this.loadCategories(); // Recharger les catégories
            this.loading = false; // Désactiver spinner
            this.resetForm(); // Réinitialiser formulaire
          },
        });
    } else {
      this.errorMessage = 'Tous les champs sont requis';
    }
  }

  // Supprimer une catégorie
  deleteCategory(id: number) {
    // 🔹 Ouvrir un dialog de confirmation avant suppression
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingButtonsList[id] = true; // Activer spinner bouton spécifique
        this.successMessage = '';
        this.errorMessage = '';

        // 🔹 Appel API pour supprimer la catégorie
        this.categoryService.deleteCategory(id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.successMessage = 'Catégorie supprimée avec succès ! 🗑️';
              this.store.dispatch(deleteCategory(id)); // Mettre à jour le store
            } else {
              this.errorMessage =
                response.message || 'Erreur lors de la suppression';
            }
          },
          error: (err) => {
            console.error('Erreur API', err);
            this.errorMessage =
              'Erreur lors de la suppression de la catégorie.';
          },
          complete: () => {
            this.loadingButtonsList[id] = true; // Désactiver spinner bouton
          },
        });
      } else {
        console.log('Action annulée'); // Action annulée par l'utilisateur
      }
    });
  }

  // Réinitialiser le formulaire d'ajout
  resetForm(): void {
    this.nom = '';
    this.description = '';
    this.image = null;
  }
}
