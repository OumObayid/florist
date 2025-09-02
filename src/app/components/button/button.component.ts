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
      <!-- permet d'insérer une icône -->
      {{ label }}
    </button>
  `,
 styles: [
  `
    /* Bouton vert olive outline */
    .btn-flower {
      background: transparent;          /* fond transparent */
      color: var(--vert-olive);         /* couleur texte */
      padding: 5px 20px;
      font-size: 1rem;
      border-radius: 30px;
      border: 1px solid var(--vert-olive);  /* bordure outline */
      transition: 0.3s ease-in-out;
      min-width: 8rem;
    }

    .btn-flower:hover {
      background: var(--vert-olive);   /* fond plein au hover */
      color: white;                     /* texte blanc */
    }

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
    /* Bouton grey outline */
    .btn-grey {
      background: transparent;
      color: #535353ff;
      border: 2px solid  #535353ff;
    }

    .btn-grey:hover {
      background: #535353ff;
      color: white;
      transform: scale(1.05);
    }

  `
]

})
export class ButtonComponent {
  @Input() label: string = 'Bouton';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() role?: string;
  @Input() ariaLabel?: string;
  // Nouvelle propriété pour ajouter des classes personnalisées
  @Input() customClass: string | string[] = '';
   @Input() customStyle: { [klass: string]: any } = {};
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}

// Exemple d'utilisation

// <app-button
//   label="Déconnexion"
//   type="button"
//   (clicked)="logout()"
// ></app-button>

// <app-button
//   label="Enregistrer"
//   type="submit"
//   [disabled]="isSaving"
// ></app-button>

// <app-button
//   label="Fermer"
//   ariaLabel="Fermer la fenêtre"
//   (clicked)="closeModal()"
// >
//   <i class="bi bi-x"></i>
// </app-button>

// <app-button
//   label="Sauvegarder"
//   customClass="my-btn-large"
//   (clicked)="save()">
//   </app-button>
//   <app-button
//   label="Fermer"
//   customClass="btn-outline-secondary"
//   >
//   <i class="bi bi-x"></i>
// </app-button>
