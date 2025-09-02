import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  selectCategories,
  selectProducts,
  setProducts,
} from '../../../ngrx/data.slice';
import { map } from 'rxjs';
import { Categorie } from '../../../interfaces/categorie';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { ProductService } from '../../../services/products/product.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TemplateDashboardComponent,
    ButtonComponent,
  ],
  templateUrl: './updateProduct.component.html',
  styleUrls: ['./updateProduct.component.css'],
})
export class UpdateProductComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  categories: Categorie[] | null = null;

  id: number | null = null;
  nom: string = '';
  description: string = '';
  prix: number = 0;
  categorie_id: string = '';
  categorie_nom: string = '';
  image: string | File | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  imagePreview: string = '';
  ngOnInit() {

    // Récupération de l'ID du produit dans l'URL
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Conversion en nombre
    // Recherche du produit dans le store
    this.store
      .select(selectProducts)
      .pipe(map((products) => products.find((p) => Number(p.id) === this.id)))
      .subscribe((prod) => {
        if (prod) {
          // Vérifie si le produit existe
          this.nom = prod.nom;
          this.description = prod.description;
          this.prix = prod.prix;
          this.image = prod.image;
          this.categorie_id = prod.categorie_id;
        } else {
          console.warn('Produit non trouvé !');
        }
      });

    // Récupération des catégories
    this.store.select(selectCategories).subscribe((datacat) => {
      this.categories = datacat;
    });
  }

  updateProduct() {
    this.loading = true;

    const formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('nom', this.nom);
    formData.append('description', this.description);
    formData.append('prix', String(this.prix));
    formData.append('categorie_id', this.categorie_id);
    // vérifier que l'image existe avant de l'ajouter
    if (this.image instanceof File) {
      formData.append('image', this.image);
    } else if (typeof this.image === 'string') {
      // si tu utilises un base64 ou un nom de fichier côté front
      formData.append('image', this.image);
    }

    this.productService.updateProduct(formData).subscribe((response) => {
      if (response.success) {
        console.log('Produit mis à jour avec succès !');

        //Mise a jours des Produit dans store
        this.productService.getProducts().subscribe((response: any) => {
          if (response.success && Array.isArray(response.products)) {
            this.store.dispatch(setProducts(response.products));
            // Redirection vers la page dashboard/products après mise à jour
            this.router.navigate(['/admin/products']); // Redirection ici
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

  cancelEdit() {
    this.router.navigate(['/admin/products']);
  }
}
