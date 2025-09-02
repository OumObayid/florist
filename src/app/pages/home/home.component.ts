import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCarouselComponent } from '../../components/product-carousel/product-carousel.component';

import { LinkButtonComponent } from "../../components/link-buton/link-buton.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule, ProductCarouselComponent, LinkButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  avisClients = [
    {
      nom: 'Oumaima',
      message: 'Les bouquets sont magnifiques et durent longtemps ! 🌸',
    },
    {
      nom: 'Sara',
      message:
        'Un excellent service, des fleurs fraîches et un accueil chaleureux.',
    },
    {
      nom: 'Amine',
      message: "J'adore leur collection de roses, toujours éclatantes !",
    },
    {
      nom: 'Lina',
      message:
        'Livraison rapide et soignée, je suis toujours satisfaite de mes commandes !',
    },
    {
      nom: 'Adam',
      message:
        "Le choix des fleurs est impressionnant et l'emballage est soigné.",
    },
  ];
 

}
