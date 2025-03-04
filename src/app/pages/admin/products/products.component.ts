import { addProduct, deleteProduct, selectCategories, selectProducts, setProducts } from './../../../ngrx/data.slice';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Categorie } from '../../../interfaces/categorie';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AddProductService } from '../../../services/product/addProduct.service';
import { DeleteProductService } from '../../../services/product/deleteProduct.service';
import { ProductsService } from '../../../services/product/products.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] | null = null;
  categories: Categorie[] | null = null;

  // Champs du formulaire
  nom: string = '';
  description: string = '';
  prix: number = 0;
  categorie_id: string = '';
  Categorie_nom:string=''
  image: File | null = null;

  constructor(
    public store: Store,
    private addProductService: AddProductService,
    private deleteProductService:DeleteProductService,
    private productsService :ProductsService
  ) {}

  ngOnInit(): void {
    this.store.select(selectProducts).subscribe((dataProd) => {
      this.products = dataProd;
    });
    this.store.select(selectCategories).subscribe((datacat) => {
      this.categories = datacat;
    });
  }
  // Gestion de l'image sélectionnée
  onFileSelected(event: any): void {
    this.image = event.target.files[0];
  }

  // Ajout d'un produit
  addProduct(): void {
    console.log('Valeurs avant validation :', {
    nom: this.nom,
    description: this.description,
    prix: this.prix,
    categorie_id: this.categorie_id,
    image: this.image
  })
    if (this.nom && this.description && this.prix && this.categorie_id && this.image) {
      
  
      this.addProductService.addProduct(this.nom, this.description, this.prix, this.categorie_id, this.image)
        .subscribe({
          next: (response) => {
            if (response.success) {
              const newProduct: any = {
                id: response.id, // ID du produit retourné par l'API
                nom: this.nom,
                description: this.description,
                prix: this.prix,
                categorie_id: this.categorie_id,
                image: response.image // Image encodée en Base64 ou BLOB
              };
  
              // Dispatch pour mettre à jour le store NgRx
              // this.store.dispatch(addProduct(newProduct));
              this.productsService.getProducts().subscribe((response: any) => {
                    // console.log("Produits récupérés depuis l'API dans app:", response);
                    if (response.success && Array.isArray(response.products)) {
                      this.store.dispatch(setProducts(response.products));
                    } else {
                      console.error('Erreur: Format de données invalide!', response);
                    }
                  });
               
              alert('Produit ajouté avec succès ! 🎉');
              this.resetForm(); // Réinitialise le formulaire
            } else {
              alert('Erreur : ' + response.message);
            }
          },
          error: (err) => {
            console.error('Erreur API', err);
            alert('Erreur lors de l\'ajout du produit.');
          },
          
        });
    } else {
      alert('Tous les champs sont requis ❌');
    }
  }
  
  // 🧹 Réinitialisation du formulaire après ajout
  resetForm(): void {
    this.nom = '';
    this.description = '';
    this.prix = 0;
    this.categorie_id = '';
    this.image = null;
  }
  deleteProduct(id:number){
            this.deleteProductService.deleteProduct(id).subscribe((response: any) => {
              if (response.success) {
                this.store.dispatch(deleteProduct(id));
              } else {
                console.error('Erreur: Format de données invalide!', response);
              }
            });
       }
       
  
}
