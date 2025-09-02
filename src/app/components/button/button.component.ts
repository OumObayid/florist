/*
 * Projet Flower-Shop
 * Page : Bouton réutilisable
 *
 * Description :
 * Composant de bouton réutilisable avec personnalisation
 * du style, des classes, du type et des événements.
 * Permet d’afficher un texte et d’insérer du contenu additionnel
 * comme des icônes.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [attr.role]="role"
      [attr.aria-label]="ariaLabel || label"
      [ngClass]="['btn-flower', customClass]"
      [ngStyle]="customStyle"
      (click)="onClick()"
    >
      <ng-content></ng-content>
      <!-- Contenu du bouton (texte ou icône) -->
      {{ label }}
    </button>
  `,
  styles: [
    `
    /* Bouton vert olive outline */
    .btn-flower {
      background: transparent;          /* fond transparent */
      color: var(--vert-olive);         /* couleur du texte */
      padding: 5px 20px;
      font-size: 1rem;
      border-radius: 30px;
      border: 1px solid var(--vert-olive);  /* bordure outline */
      transition: 0.3s ease-in-out;
      min-width: 8rem;
    }

    /* Effet au survol */
    .btn-flower:hover {
      background: var(--vert-olive);   /* fond plein */
      color: white;                     /* texte blanc */
    }

    /* Style lorsque le bouton est désactivé */
    .btn-flower:disabled {
      background: #ccc;
      border-color: #ccc;
      cursor: not-allowed;
      color: #666;
    }

    /* Bouton rouge brique outline */
    .btn-rouge-brique {
      background: transparent;
      color: var(--rouge-brique);
      border: 1px solid var(--rouge-brique);
    }

    .btn-rouge-brique:hover {
      background: var(--rouge-brique);
      color: white;
    }

    /* Bouton gris outline */
    .btn-grey {
      background: transparent;
      color: #535353ff;
      border: 2px solid  #535353ff;
    }

    .btn-grey:hover {
      background: #535353ff;
      color: white;
      transform: scale(1.05);          /* léger effet zoom */
    }
    `
  ]
})
export class ButtonComponent {
  // Texte affiché dans le bouton
  @Input() label: string = 'Bouton';

  // Type du bouton : button, submit ou reset
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  // Détermine si le bouton est désactivé
  @Input() disabled: boolean = false;

  // Attribut ARIA role (optionnel)
  @Input() role?: string;

  // Libellé ARIA pour l’accessibilité (optionnel)
  @Input() ariaLabel?: string;

  // Classes CSS personnalisées à ajouter au bouton
  @Input() customClass: string | string[] = '';

  // Styles CSS personnalisés à appliquer au bouton
  @Input() customStyle: { [klass: string]: any } = {};

  // Événement déclenché lors du clic sur le bouton
  @Output() clicked = new EventEmitter<void>();

  // Gestion du clic : déclenche l’événement si le bouton n’est pas désactivé
  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}

// Exemples d'utilisation du composant
// <app-button label="Déconnexion" type="button" (clicked)="logout()"></app-button>
// <app-button label="Enregistrer" type="submit" [disabled]="isSaving"></app-button>
// <app-button label="Fermer" ariaLabel="Fermer la fenêtre" (clicked)="closeModal()">
//   <i class="bi bi-x"></i>
// </app-button>
// <app-button label="Sauvegarder" customClass="my-btn-large" (clicked)="save()"></app-button>
// <app-button label="Fermer" customClass="btn-outline-secondary">
//   <i class="bi bi-x"></i>
// </app-button>
