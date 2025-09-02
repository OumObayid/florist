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
 categories: Categorie[] = [];

  constructor(private store: Store) {}
ngOnInit(): void {
    this.store.select(selectCategories).subscribe(data => { 
        this.categories = data;     
    });
  }
}




