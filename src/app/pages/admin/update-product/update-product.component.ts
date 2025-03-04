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
  updateProduct,
} from '../../../ngrx/data.slice';
import {  map } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { Categorie } from '../../../interfaces/categorie';
import { UpdateProductsService } from '../../../services/product/updateProduct.service';
import { ProductsService } from '../../../services/product/products.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent implements OnInit {
  constructor(
    private updateProductService: UpdateProductsService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {}

  categories: Categorie[] | null = null;

  id: number | null = null;
  nom: string = '';
  description: string = '';
  prix: number = 0;
  categorie_id: string = '';
  categorie_nom: string = '';
  image: string | File | null = null;


  ngOnInit() {
    // Récupération de l'ID du produit dans l'URL
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Conversion en nombre

    console.log('ID récupéré :', this.id); // 🔍 Vérifie si un ID s'affiche

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
          this.categorie_id=prod.categorie_id;
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
   
    const productUpdated: any = {
      id: this.id!,
      nom: this.nom,
      description: this.description,
      prix: Number(this.prix),
      categorie_id: this.categorie_id,
      image: this.image,
    };

    console.log('Produit envoyé :', productUpdated);

    this.updateProductService
      .updateProduct(productUpdated)
      .subscribe((response) => {
        if (response.success) {
          console.log('Produit mis à jour avec succès !');

           //Mise a jours des Produit dans store
              this.productsService.getProducts().subscribe((response: any) => {
                // console.log("Produits récupérés depuis l'API dans app:", response);
                if (response.success && Array.isArray(response.products)) {
                  this.store.dispatch(setProducts(response.products));
                } else {
                  console.error('Erreur: Format de données invalide!', response);
                }
              });

          // Redirection vers la page dashboard/products après mise à jour
          this.router.navigate(['/admin/products']); // Redirection ici
        } else {
          console.error('Erreur lors de la mise à jour :', response.message);
        }
      });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0]; // ✅ Stocker l'image sélectionnée
      console.log('Image sélectionnée:', this.image);
    }
  }
  
   cancelEdit() {   
    this.router.navigate(['/admin/products']);
  }
}
