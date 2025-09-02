import { Component } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectProducts } from '../../ngrx/data.slice';
import { LinkButtonComponent } from "../link-buton/link-buton.component";

@Component({
  selector: 'app-product-carousel',
  imports: [CommonModule, RouterLink, LinkButtonComponent],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css',
})
export class ProductCarouselComponent {
  products: Product[] | null = null;
  loading: boolean = true;
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.store.select(selectProducts).subscribe((data) => {
      if (data.length > 0) {
        this.products = data;
        this.loading = false;
      }
    });
  }
}
