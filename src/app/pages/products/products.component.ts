import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProducts } from '../../ngrx/data.slice';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";
import { LinkButtonComponent } from "../../components/link-buton/link-buton.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BannerTitleComponent, LinkButtonComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
    products: Product[] = [];
    loading : boolean= true;
  constructor(private store: Store) {}
ngOnInit(): void {
    this.store.select(selectProducts).subscribe(data => { 
      if (data.length>0){
        this.products = data;     
        this.loading=false;

      }
    });
  }
}
