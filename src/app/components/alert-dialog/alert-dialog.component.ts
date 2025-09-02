/*
 * Projet flower-shop
 * Page : Boîte de dialogue d’alerte
 *
 * Description :
 * Composant réutilisable permettant d’afficher une boîte de dialogue
 * modale avec un titre, un message, un bouton de confirmation
 * et un bouton d’annulation. La boîte est affichée ou masquée
 * en fonction de la propriété "visible".
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <!-- Overlay affiché uniquement si "visible" est vrai -->
    <div class="overlay" *ngIf="visible">
      <div class="dialog">
        <!-- Titre et message de la boîte de dialogue -->
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>

        <!-- Actions : boutons Annuler et Confirmer -->
        <div class="actions  d-flex flex-column flex-md-row gap-2">
          <app-button
            [label]="cancelText"
            (clicked)="onCancel()"
            customClass="btn-grey"
          ></app-button>

          <app-button
            [label]="confirmText"
            (clicked)="onConfirm()"
          ></app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Zone semi-transparente couvrant tout l’écran */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
    }

    /* Conteneur de la boîte de dialogue */
    .dialog {
      border: 4px solid var(--rouge-brique);
      background: white;
      padding: 20px;
      border-radius: 12px;
      width: 500px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      animation: fadeIn 0.25s ease;
    }

    /* Section contenant les boutons */
    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }

    /* Animation d’apparition */
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class AlertDialogComponent {
  // Détermine si la boîte de dialogue est visible
  @Input() visible = false;

  // Titre affiché dans la boîte de dialogue
  @Input() title = 'Alerte';

  // Message affiché dans la boîte de dialogue
  @Input() message = 'Message de l’alerte';

  // Texte du bouton de confirmation
  @Input() confirmText = 'OK';

  // Texte du bouton d’annulation
  @Input() cancelText = 'Annuler';

  // Événement émis lorsque l’utilisateur ferme la boîte
  // true = confirmé, false = annulé
  @Output() closed = new EventEmitter<boolean>();

  // Gère l’action de confirmation
  onConfirm() {
    this.closed.emit(true);
    this.visible = false;
  }

  // Gère l’action d’annulation
  onCancel() {
    this.closed.emit(false);
    this.visible = false;
  }
}
