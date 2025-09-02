/*
 * Projet Flower-Shop
 * Page : Template Dashboard
 *
 * Description :
 * Composant réutilisable pour les pages du tableau de bord.
 * Affiche un titre de page, un séparateur horizontal et un conteneur
 * pour insérer dynamiquement le contenu spécifique de chaque page.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

// Composant TemplateDashboard
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-template-dashboard',
  imports: [],
  template: `
    <div class="page-template-container">
      <h2 class="page-title">{{ title }}</h2>
      <hr class="page-hr" />
      <div class="page-content">
        <ng-content></ng-content>
        <!-- Ici on insère le contenu de chaque page -->
      </div>
    </div>
  `,
  styles: [
    `
      .page-template-container {
        padding: 10px 5px;
        background: #f9f9f9;
        border-radius: 8px;
        min-height: 100vh;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .page-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--vert-olive-fonc);
        text-align: center;
      }
      .page-hr {
        border: 1px solid var(--vert-olive-fonc);
        margin-bottom: 20px;
      }
      .page-content {
        padding: 10px;
      }
    `,
  ],
})
export class TemplateDashboardComponent {
  // Titre de la page affiché en haut
  @Input() title: string = 'Titre de la page';
}
