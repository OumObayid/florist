/*
 * Projet Flower-Shop
 * Page : User Layout
 *
 * Description :
 * Composant de mise en page pour l'espace utilisateur. Gère l'affichage de la sidebar
 * et du contenu principal pour les écrans desktop et mobile. Sur mobile, la sidebar
 * est cachée par défaut et peut être ouverte via un bouton hamburger. Un overlay
 * semi-transparent apparaît derrière la sidebar pour désactiver l'interaction
 * avec le reste de la page.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarUserComponent } from '../../sidebars/sidebar-user/sidebarUser.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, SidebarUserComponent, CommonModule],
  template: `
    <!-- Layout Desktop -->
    <div class="d-flex side-desktop" *ngIf="!isMobile">
      <!-- Sidebar visible sur desktop -->
      <app-sidebarUser></app-sidebarUser>
      <!-- Contenu principal -->
      <div class="flex-grow-1 p-4">
        <router-outlet></router-outlet>
      </div>
    </div>

    <!-- Layout Mobile -->
    <div class="side-mobile position-relative" *ngIf="isMobile">
      <!-- Bouton hamburger pour ouvrir/fermer la sidebar mobile -->
      <button
        class="btn d-md-none shadow-none border-0"
        (click)="sidebarVisible = !sidebarVisible"
        style="z-index: 1020; position: fixed; top: 120px; left: 0px;"
      >
        <i
          style="color:var(--rouge-brique); font-size:25px"
          class="fa-solid"
          [ngClass]="{ 'fa-arrow-circle-right ': !sidebarVisible, 'fa-arrow-circle-left': sidebarVisible }"
        ></i>
      </button>

      <!-- Sidebar mobile -->
      <div (click)="sidebarVisible = !sidebarVisible" class="mobile-sidebar" [ngClass]="{ show: sidebarVisible }">
        <app-sidebarUser></app-sidebarUser>
      </div>

      <!-- Overlay semi-transparent derrière la sidebar mobile -->
      <div
        class="overlay"
        *ngIf="sidebarVisible"
        (click)="sidebarVisible = false"
      ></div>

      <!-- Contenu principal -->
      <div class="content flex-grow-1 px-4">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      /* Sidebar mobile cachée par défaut */
      .mobile-sidebar {
        position: fixed;
        top: 95px;
        left: -275px;
        width: 250px;
        height: 100%;
        transition: left 0.3s ease;
        z-index: 1000;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
      }

      /* Sidebar mobile visible */
      .mobile-sidebar.show {
        left: 0;
      }

      /* Overlay semi-transparent derrière la sidebar mobile */
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 940;
      }

      /* Ajustement du contenu principal pour laisser la place au bouton hamburger */
      .side-mobile .content {
        margin-top: 45px;
      }
    `,
  ],
})
export class UserLayoutComponent {
  sidebarVisible = false; // État de visibilité de la sidebar mobile
  isMobile = false; // Détecte si l'affichage est sur mobile

  constructor() {
    this.checkScreen(); // Vérifie la largeur initiale de l'écran
    window.addEventListener('resize', () => this.checkScreen()); // Met à jour isMobile au redimensionnement
  }

  // Méthode pour déterminer si l'écran est mobile
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
}
