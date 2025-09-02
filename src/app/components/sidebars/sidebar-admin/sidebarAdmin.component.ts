/*
 * Projet Flower-Shop
 * Page : Sidebar Admin
 *
 * Description :
 * Composant affichant la barre latérale de l'interface administrateur.
 * Fournit la navigation vers les différentes sections de l'administration
 * et permet la déconnexion de l'utilisateur connecté.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

// Composant SidebarAdmin
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeActiveUser } from '../../../ngrx/auth.slice';
import { ButtonComponent } from "../../button/button.component";

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './sidebarAdmin.component.html',
  styleUrl: './sidebarAdmin.component.css'
})
export class SidebarAdminComponent {
  constructor(
    public router: Router,
    private store: Store
  ) {}

  // Déconnexion de l'utilisateur et redirection vers la page login
  logout() {
    this.store.dispatch(removeActiveUser());
    this.router.navigate(['/login']);
  }
}
