import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { selectCategories, updateCategory } from '../../../ngrx/data.slice';
import { Categorie } from '../../../interfaces/categorie';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { map } from 'rxjs';
import { CategoriesService } from '../../../services/categories/categories.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TemplateDashboardComponent,
    ButtonComponent,
  ],
  templateUrl: './updateCategory.component.html',
  styleUrls: ['./updateCategory.component.css'],
})
export class UpdateCategoryComponent implements OnInit {
  id: number | null = null;
  nom: string = '';
  description: string = '';
  image: string | File | null = null;
  imagePreview: string | null = null;
  loading: boolean = false;
  loading2: boolean = false;
  errorMessage: string = '';
  categories: Categorie[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private categoryService: CategoriesService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupération de l'ID du produit dans l'URL
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Conversion en nombre

    // Recherche du produit dans le store
    this.store
      .select(selectCategories)
      .pipe(
        map((categories) => categories.find((p) => Number(p.id) === this.id))
      )
      .subscribe((cat) => {
        if (cat) {
          // Vérifie si le categorie existe
          this.nom = cat.nom;
          this.description = cat.description;
          this.image = cat.image;
        } else {
          console.warn('Categorie non trouvé !');
        }
      });
  }

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

 
  updateCategory() {
    this.loading = true;
    const categoryUpdated: any = {
      id: this.id!,
      nom: this.nom,
      description: this.description,
      image: this.image,
    };


    this.categoryService
      .updateCategory(categoryUpdated)
      .subscribe((response) => {
        if (response.success) {
          console.log('Produit mis à jour avec succès !');

          //Mise a jours des Produit dans store
          this.categoriesService
            .getCategories()
            .subscribe((response: any) => {
              if (response.success && Array.isArray(response.categories)) {
                this.store.dispatch(updateCategory(categoryUpdated));
                // Redirection vers la page dashboard/categories après mise à jour
                this.router.navigate(['/admin/categories']); // Redirection ici
              } else {
                this.loading = false;
                this.errorMessage = response.message;
                console.error(
                  'Erreur: Format de données invalide!',
                  response.message
                );
              }
            });
        } else {
          this.loading = false;
          this.errorMessage = response.message;
          console.error('Erreur lors de la mise à jour :', response.message);
        }
      });
  }

  cancelEdit() {
    window.history.back();
  }
}
