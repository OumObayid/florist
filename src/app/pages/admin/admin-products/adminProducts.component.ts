/*
 * Projet Flower-Shop
 * Page : Admin Products
 *
 * Description :
 * Composant de gestion des produits côté administrateur.
 * Permet d'ajouter, supprimer et afficher les produits avec pagination.
 * Gère également la sélection d'images et l'affichage de messages de succès ou d'erreur.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Categorie } from '../../../interfaces/categorie';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { ProductService } from '../../../services/products/product.service';
import {
  addProduct,
  deleteProduct,
  selectCategories,
  selectProducts,
} from '../../../ngrx/data.slice';
import { LinkButtonComponent } from '../../../components/link-buton/link-buton.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TemplateDashboardComponent,
    ButtonComponent,
    LinkButtonComponent,
  ],
  templateUrl: './adminProducts.component.html',
  styleUrls: ['./adminProducts.component.css'],
})
export class AdminProductsComponent implements OnInit {
  // Liste complète de produits
  products: Product[] = [];
  // Liste paginée des produits affichés
  paginatedProducts: Product[] = [];
  // Liste des catégories
  categories: Categorie[] = [];
  // Indicateur de chargement pour le bouton "Ajouter"
  isLoadingButtonAdd: boolean = false;
  // Indicateur de chargement spécifique pour chaque bouton "Supprimer"
  loadingButtonsList: { [id: number]: boolean } = {};
  // Indicateur de chargement de la liste
  isLoadingListe: boolean = false;
  // Messages d'état
  successMessage: string = '';
  errorMessage: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 60;
  totalPages: number = 1;

  // Champs du formulaire d'ajout de produit
  nom: string = '';
  description: string = '';
  prix: number = 0;
  categorie_id: string = '';
  Categorie_nom: string = '';
  image: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private store: Store,
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Charger la liste des produits
    this.isLoadingListe = true;
    this.store.select(selectProducts).subscribe((prod) => {
      this.products = prod || [];
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      this.updatePaginatedProducts();
      if (this.products.length > 0) this.isLoadingListe = false;
    });

    // Charger la liste des catégories
    this.store.select(selectCategories).subscribe((datacat) => {
      this.categories = datacat || [];
    });
  }

  // Gestion de la sélection d'image
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0];

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  // Ajout d'un produit
  addProduct(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (
      this.nom &&
      this.description &&
      this.prix &&
      this.categorie_id &&
      this.image
    ) {
      this.isLoadingButtonAdd = true;
      const formData = new FormData();
      formData.append('nom', this.nom);
      formData.append('description', this.description);
      formData.append('prix', this.prix.toString());
      formData.append('categorie_id', this.categorie_id);

      if (this.image instanceof File) {
        formData.append('image', this.image);
      } else if (typeof this.image === 'string') {
        formData.append('image', this.image);
      }

      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Produit ajouté avec succès !';
            this.store.dispatch(addProduct(response.product));
            this.resetForm();
          } else {
            this.errorMessage = response.message || "Erreur lors de l'ajout";
          }
        },
        error: (err) => {
          console.error('Erreur API', err);
          this.errorMessage = "Erreur lors de l'ajout du produit.";
        },
        complete: () => {
          this.refreshProductsList(this.products, true);
          this.isLoadingButtonAdd = false;
        },
      });
    } else {
      this.errorMessage = 'Tous les champs sont requis';
    }
  }

  // Suppression d'un produit
  deleteProduct(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.successMessage = '';
        this.errorMessage = '';
        this.loadingButtonsList[id] = true;
        this.productService.deleteProduct(id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.store.dispatch(deleteProduct(id));
              this.successMessage = 'Produit supprimé';

              // Mise à jour locale de la liste
              this.products = this.products.filter((p) => p.id !== id);
              this.refreshProductsList(this.products);
            } else {
              this.errorMessage =
                response.message || 'Erreur lors de la suppression';
            }
          },
          error: (err) => {
            console.error('Erreur API', err);
            this.errorMessage = 'Erreur lors de la suppression du produit.';
          },
          complete: () => {
            this.loadingButtonsList[id] = false;
          },
        });
      } else {
        console.log('Action annulée');
      }
    });
  }

  // Pagination
  updatePaginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  // Rafraîchir la liste des produits avec gestion de pagination
  private refreshProductsList(
    products: Product[],
    goToLastPage: boolean = false
  ): void {
    this.products = products || [];
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);

    if (goToLastPage) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    this.updatePaginatedProducts();
  }

  // Réinitialisation du formulaire
  resetForm(): void {
    this.nom = '';
    this.description = '';
    this.prix = 0;
    this.categorie_id = '';
    this.image = null;
    this.imagePreview = null;
  }
}
