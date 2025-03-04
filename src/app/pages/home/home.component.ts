import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { selectProducts } from '../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private store: Store) {}

  avisClients = [
    { nom: "Oumaima", message: "Les bouquets sont magnifiques et durent longtemps ! 🌸" },
    { nom: "Sara", message: "Un excellent service, des fleurs fraîches et un accueil chaleureux." },
    { nom: "Amine", message: "J'adore leur collection de roses, toujours éclatantes !" },
    { nom: "Lina", message: "Livraison rapide et soignée, je suis toujours satisfaite de mes commandes !" },
    { nom: "Adam", message: "Le choix des fleurs est impressionnant et l'emballage est soigné." }
  ];

  ngOnInit(): void {
    this.store.select(selectProducts).subscribe(data => {
      if (Array.isArray(data) && data.length > 0) {
        this.products = this.shuffleArray(data); // Appliquer le mélange sur une copie
      } else {
        console.error("Erreur : les produits ne sont pas récupérés correctement.");
        this.products = [];
      }
    });
  }
  

  // Mélanger les produits de manière aléatoire
  private shuffleArray(array: Product[]): Product[] {
    const shuffledArray = [...array]; // Clone le tableau pour éviter les problèmes d'immuabilité
    return shuffledArray.sort(() => Math.random() - 0.5);
  }
  

}
