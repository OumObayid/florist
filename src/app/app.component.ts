import { GetCategoriesService } from './services/categories/getCategories.service';
import { ProductsService } from './services/product/products.service';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Product } from './interfaces/product';
import { Store } from '@ngrx/store';
import { getCategories, setProducts, setUsers } from './ngrx/data.slice';
import { UsersService } from './services/users/users.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  title = 'flowersOum';
  products: Product | null = null;

  constructor(
    private store: Store,
    private usersService: UsersService,
    private productsService: ProductsService,
    private getCategoriesService: GetCategoriesService
  ) {}

  ngOnInit(): void {
    //Product
    this.productsService.getProducts().subscribe((response: any) => {
      // console.log("Produits récupérés depuis l'API dans app:", response);
      if (response.success && Array.isArray(response.products)) {
        this.store.dispatch(setProducts(response.products));
      } else {
        console.error('Erreur: Format de données invalide!', response);
      }
    });
    //user
    this.usersService.getUsers().subscribe((response: any) => {
      // console.log("users récupérés depuis l'API dans app:", response);

      if (response.success && Array.isArray(response.dataUsers)) {
        this.store.dispatch(setUsers(response.dataUsers));
      } else {
        console.error('Erreur: Format de données invalide!', response);
      }
    });
    //categories

    this.getCategoriesService.getCategories().subscribe((response: any) => {
      // console.log('response from App :', response);

      if (response.success && Array.isArray(response.categories)) {
        this.store.dispatch(getCategories(response.categories));
      } else {
        console.error('Erreur: Format de données invalide!', response);
      }
    });
  }
}
