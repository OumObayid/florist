/*
 * Projet Flower-Shop
 * Page : Contact
 *
 * Description :
 * Gère la page de contact où l'utilisateur peut envoyer un message via un formulaire.
 * Contient les champs nom, email et message, ainsi qu'une méthode onSubmit pour traiter les données.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";
import { ButtonComponent } from "../../components/button/button.component";

@Component({
  selector: 'app-contact',
  imports: [FormsModule, BannerTitleComponent, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  // Champs du formulaire
  name: string = '';
  email: string = '';
  message: string = '';

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    console.log('Form submitted!', this.name, this.email, this.message);
    // Vous pouvez ajouter ici le traitement du formulaire, comme envoyer les données à un serveur.
  }
}

