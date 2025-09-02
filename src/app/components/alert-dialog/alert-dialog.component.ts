

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="overlay" *ngIf="visible">
      <div class="dialog">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
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
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
    }
    .dialog {
      border:4px solid var(--rouge-brique);
      background: white;
      padding: 20px;
      border-radius: 12px;
      width: 500px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      animation: fadeIn 0.25s ease;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class AlertDialogComponent {
  @Input() visible = false;
  @Input() title = 'Alerte';
  @Input() message = 'Message de l’alerte';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Annuler';

  @Output() closed = new EventEmitter<boolean>();

  onConfirm() {
    this.closed.emit(true);
    this.visible = false;
  }

  onCancel() {
    this.closed.emit(false);
    this.visible = false;
  }
}
