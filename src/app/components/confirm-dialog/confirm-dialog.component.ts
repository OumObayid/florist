/*
 * Projet Flower-Shop
 * Page : Boîte de dialogue de confirmation (Confirm Dialog)
 *
 * Description :
 * Composant affichant une boîte de dialogue modale pour confirmer ou annuler
 * une action. Utilisé par exemple pour la suppression d'un article du panier.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from "../button/button.component";

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  imports: [MatDialogModule, ButtonComponent],
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  // Ferme la boîte de dialogue et renvoie "false" au parent
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Ferme la boîte de dialogue et renvoie "true" au parent
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
