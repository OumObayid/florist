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

  onCancel(): void {
    this.dialogRef.close(false); // Renvoie "false" si l'utilisateur annule
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Renvoie "true" si l'utilisateur confirme
  }
}
