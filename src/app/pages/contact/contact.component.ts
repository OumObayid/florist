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
  name: string = '';
  email: string = '';
  message: string = '';

  onSubmit() {
    console.log('Form submitted!', this.name, this.email, this.message);
    // Vous pouvez ajouter ici le traitement du formulaire, comme envoyer les données à un serveur.
  }
}
