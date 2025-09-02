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
  categorie_id: string = '';
  nom: string = '';
  description: string = '';
  image: File | null = null;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  categories: Categorie[] = [];

  loadingButtonsList: { [id: number]: boolean } = {};
  loading: boolean = false;
  loading2: boolean = false;
 

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    public store: Store,
    private categoryService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading2 = true;
    this.store.select(selectCategories).subscribe((dataCat) => {
      this.categories = dataCat || [];
      if (this.categories.length > 0) this.loading2 = false;
    });
  }
  // méthode réutilisable
  loadCategories(): void {
    this.store.select(selectCategories).subscribe((dataCat) => {
      this.categories = dataCat || [];
    });
  }
  // Gestion de l'image
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0]; // ✅ Stocker l'image sélectionnée

      // 🔹 Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  // Ajout d'une catégorie
  addCategorie(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.nom && this.description && this.image) {
      this.loading = true;
      this.categoryService
        .addCategory(this.nom, this.description, this.image)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.successMessage = 'Categorie a été ajouté avec success';
              this.store.dispatch(response.category);
            } else {
              this.errorMessage = response.message || "Erreur lors de l'ajout";
            }
          },
          error: (err) => {
            console.error('Erreur API', err);
            this.errorMessage = "Erreur lors de l'ajout de la catégorie.";
          },
          complete: () => {
            this.loadCategories();
            // 👉 Toujours libérer loading et vider form après tout
            this.loading = false;
            this.resetForm();
          },
        });
    } else {
      this.errorMessage = 'Tous les champs sont requis';
    }
  }

  // Supprimer une catégorie
  deleteCategory(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      this.loadingButtonsList[id] = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.categoryService.deleteCategory(id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.successMessage = 'Catégorie supprimée avec succès ! 🗑️';
              this.store.dispatch(deleteCategory(id)); // Dispatch NgRx
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
           this.loadingButtonsList[id] = true;
          },
        });
      } else {
        console.log('Action annulée');
      }
    });
  }

  resetForm(): void {
    this.nom = '';
    this.description = '';
    this.image = null;
  }
}
