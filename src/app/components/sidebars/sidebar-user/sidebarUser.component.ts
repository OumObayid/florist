/*
 * Projet Flower-Shop
 * Page : Sidebar User
 *
 * Description :
 * Composant affichant la barre latérale de l'interface utilisateur.
 * Fournit la navigation vers les différentes sections pour un utilisateur connecté
 * et permet la déconnexion de l'utilisateur.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

// Composant SidebarUser
import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Store } from '@ngrx/store';
import { removeActiveUser } from '../../../ngrx/auth.slice';
import { ButtonComponent } from "../../button/button.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebarUser',
  imports: [RouterLink, ButtonComponent, CommonModule],
  templateUrl: './sidebarUser.component.html',
  styleUrl: './sidebarUser.component.css'
})
export class SidebarUserComponent {
  sidebarVisible: boolean = false;

  // Détecte si l'écran est de taille mobile
  isMobile(): boolean {
    return window.innerWidth < 768; 
  }

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
