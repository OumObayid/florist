import { LinkButtonComponent } from './../../components/link-buton/link-buton.component';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Categorie } from '../../interfaces/categorie';
import { Product } from '../../interfaces/product';
import { selectCategories, selectProducts } from '../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";

@Component({
  selector: 'app-categorie-details',
  imports: [CommonModule, FormsModule, RouterLink, BannerTitleComponent,LinkButtonComponent],
  templateUrl: './categorie-details.component.html',
  styleUrls: ['./categorie-details.component.css'],
  standalone: true,
})
export class CategorieDetailsComponent {
  categorie: Categorie | undefined;
  id: number | null = null;
  products: Product[] = [];

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;

    // Récupérer la catégorie
    this.store
      .select(selectCategories)
      .pipe(
        map((categories) =>
          categories.find((c) => Number(c.id) === Number(this.id))
        )
      )
      .subscribe((cat) => {
        this.categorie = cat;
      });

    // Récupérer les produits de cette catégorie
    this.store
      .select(selectProducts)
      .pipe(
        map((products) =>
          products.filter((p) => Number(p.categorie_id) === Number(this.id))
        )
      )
      .subscribe((filteredProducts) => {
        this.products = filteredProducts;
      });
  }
  
}
