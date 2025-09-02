import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a
      [routerLink]="routerLink"
      [queryParams]="queryParams"
      class="btn btn-flower"
      [attr.role]="role"
      [attr.id]="id"
      [attr.title]="title"
      [attr.target]="target"
      [attr.aria-label]="ariaLabel"
      [attr.data-test]="dataTest"
      [ngClass]="['btn-flower', customClass]"
      [ngStyle]="customStyle"
    >
      <ng-content></ng-content>
      {{ label }}
    </a>
  `,
  styles: [
    `
      /* Bouton vert olive outline */
      .btn-flower {
        background: transparent; /* fond transparent */
        color: var(--vert-olive); /* couleur texte */
        padding: 5px 20px;
        font-size: 1rem;
        border-radius: 30px;
        border: 1px solid var(--vert-olive); /* bordure outline */
        transition: 0.3s ease-in-out;
        min-width: 8rem;
      }

      .btn-flower:hover {
        background: var(--vert-olive); /* fond plein au hover */
        color: white; /* texte blanc */
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

      /* Bouton rouge brique plein  */
      .btn-rouge-brique-plein {
        background-color: var(--rouge-brique);
        color: white;
        border-color: var(--rouge-brique);
        transition: transform 0.2s ease;
      }

      .btn-rouge-brique-plein:hover {
        background: var(--rouge-brique-clair);
        transform: scale(1.05);
      }
    `,
  ],
})
export class LinkButtonComponent {
  @Input() routerLink: any[] | string = '/';
  @Input() queryParams?: Record<string, any>;

  // propriétés communes que tu pourrais avoir besoin
  @Input() label = '';
  @Input() role: string = 'button';
  @Input() id?: string;
  @Input() title?: string;
  @Input() target?: string;
  @Input() ariaLabel?: string;
  @Input() dataTest?: string; // utile pour les tests e2e
  @Input() customClass: string | string[] = '';
  @Input() customStyle: { [klass: string]: any } = {};
}
// Exemple d’utilisation

// <app-link-button
//   label="Voir Produits"
//   [routerLink]="['/products']"
// ></app-link-button>

// <app-link-button
//   label="Détails"
//   [routerLink]="['/product-details', product.id]"
//   [queryParams]="{ ref: 'home' }"
// >
//   <i class="bi bi-eye"></i>
// </app-link-button>

// <app-link-button
//   [routerLink]="['/product-details', product.id]"
//   [queryParams]="{ ref: 'home' }"
//   label="Voir le produit"
//   id="btn-voir-produit"
//   title="Cliquez pour voir le produit"
//   ariaLabel="Voir le produit {{ product.name }}"
//   target="_blank"
//   dataTest="product-btn"
// >
//   <i class="bi bi-eye"></i>
// </app-link-button>

// <app-link-button
//   [routerLink]="['/product-details', product.id]"
//   label="Voir le produit"
//   customClass="btn-lg text-uppercase shadow"
//   id="voir-produit"
//   title="Aller aux détails"
// >
//   <i class="bi bi-eye"></i>
// </app-link-button>
