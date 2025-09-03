import { RouterLink } from '@angular/router';
/*
 * Projet Flower-Shop
 * Page : Footer
 *
 * Description :
 * Composant affichant le pied de page du site. 
 * Affiche notamment l'année en cours automatiquement.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],                // Aucun module externe requis
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Récupère automatiquement l'année en cours
  currentYear: number = new Date().getFullYear();
}
