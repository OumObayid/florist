import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { selectProducts } from '../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/product/products.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent  {
 constructor(private productService: ProductsService,
  private store: Store, private route: ActivatedRoute) {}

  product: Product | undefined ;
  id: number | null = null;
  // nom:string="";
  // description:string="";
  // prix:number=0;
  // image:string|null=null;


  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    // console.log('this.id :', this.id);
    this.store
      .select(selectProducts)
      .pipe(
        map((products) =>
          products.find((p) => Number(p.id) === Number(this.id))
        )
      )
      .subscribe((prod) => 
    {
      this.product=prod
      // this.nom=prod!.nom;
      // this.description=prod!.description;
      // this.prix=prod!.prix;
      // this.image=prod!.image;
      
    }
    
    );
  }

  
}
