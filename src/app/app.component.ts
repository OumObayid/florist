import { Component } from '@angular/core';
import {  NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Product } from './interfaces/product';
import { Store } from '@ngrx/store';
import { UsersService } from './services/users/users.service';
import { CategoriesService } from './services/categories/categories.service';
import { ProductService } from './services/products/product.service';
import { getCategories, setAllOrders, setProducts, setUsers } from './ngrx/data.slice';
import { filter } from 'rxjs';
import { OrdersService } from './services/orders/orders.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styles: [`
  .class-app{
    padding-top: 110px;
    min-height: 100vh;
  }
  @media (max-width: 768px) {
    .class-app{
    padding-top: 88px;
   }
  }
    `],
})
export class AppComponent {
  title = 'flowersOum';
  products: Product | null = null;

  constructor(
    private store: Store,
    private usersService: UsersService,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private ordersService: OrdersService,
    private router: Router
    
  ) { this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, behavior: 'smooth' }));}

  ngOnInit(): void {
    //Product
    this.productService.getProducts().subscribe((response: any) => {
      if (response.success) {
        this.store.dispatch(setProducts(response.dataProd));
      } else {
        console.log('response.message :', response.message);
      }
    });
    //user
    this.usersService.getUsers().subscribe((response: any) => {
      if (response.success && Array.isArray(response.users)) {
        this.store.dispatch(setUsers(response.users));
      } else {
        console.log('Erreur: Format de données invalide!', response);
      }
    });
    //categories
    this.categoriesService.getCategories().subscribe((response: any) => {
      if (response.success && Array.isArray(response.categories)) {
        this.store.dispatch(getCategories(response.categories));
      } else {
        console.error('Erreur: Format de données invalide!', response);
      }
    });
    //All orders
      this.ordersService.getAllOrders().subscribe((response: any) => {
      if (response.success && Array.isArray(response.orders)) {
        this.store.dispatch(setAllOrders(response.orders));
      } else {
        console.error('Erreur: Format de données invalide!', response);
      }
    });


  }
}
