/*
 * Projet Flower-Shop
 * Page : Bannière avec titre
 *
 * Description :
 * Composant simple permettant d’afficher un titre principal
 * et un sous-titre en haut d’une page, sous forme de bannière.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-title',
  imports: [CommonModule],
  templateUrl: './banner-title.component.html',
  styleUrl: './banner-title.component.css',
})
export class BannerTitleComponent {
  // Texte du titre principal affiché dans la bannière
  @Input() title: string = '';

  // Texte du sous-titre affiché sous le titre principal
  @Input() underTitle: string = '';
}
