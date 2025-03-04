import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Categorie } from '../../../interfaces/categorie';
import { addCategory, deleteCategory, selectCategories } from '../../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteCategoryService } from '../../../services/categories/deleteCategory.service';
import { AddCategoryService } from '../../../services/categories/addCategory.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categoryName: string = '';
  categories:Categorie [] | null=null;
  
     constructor(public store:Store,
      private deleteCategoryService :DeleteCategoryService,
      private addCategoryService: AddCategoryService
     ){}
  
     ngOnInit(): void {
       this.store.select(selectCategories).subscribe(dataCat=>{
        // console.log('dataCat :', dataCat);
        this.categories=dataCat;
     })
     }
     deleteCategory(id:number){
          this.deleteCategoryService.deleteCategory(id).subscribe((response: any) => {
            if (response.success) {
              this.store.dispatch(deleteCategory(id));
            } else {
              console.error('Erreur: Format de données invalide!', response);
            }
          });
     }
     onSubmit() {
      if (this.categoryName.trim()) {
        this.addCategoryService.addCategory(this.categoryName).subscribe((response: any) => {
          if (response.success) {
            alert('Catégorie ajoutée avec succès !');
            this.store.dispatch(addCategory(response.id, this.categoryName)); // Envoi à NgRx
            this.categoryName = ''; // Réinitialiser le champ
          } else {
            console.error('Erreur lors de l\'ajout de la catégorie', response);
          }
        });
      }
    }
    updateCategory(){}
    
}