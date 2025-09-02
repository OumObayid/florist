/*
 * Projet : Flower-Shop
 * Page : Profil utilisateur - Tableau de bord
 *
 * Description :
 *   - Affiche les informations personnelles de l'utilisateur connecté
 *   - Permet la modification des informations de profil (nom, email, téléphone, adresse)
 *   - Permet le changement de mot de passe
 *   - Gère les messages de succès et d'erreur pour chaque action
 *   - Intègre le store NgRx pour récupérer et mettre à jour les données de l'utilisateur
 *
 * Développé par :
 *   OUMAIMA EL OBAYID
 *
 * Licence :
 *   Licence MIT
 *   https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import {
  getActiveUserInfo,
  selectUserInfoConnecter,
} from '../../../ngrx/auth.slice';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-profil',
  imports: [
    TemplateDashboardComponent, // Template général pour le tableau de bord
    FormsModule,               // Formulaire Angular
    CommonModule,              // Modules communs Angular
    ButtonComponent,           // Composant bouton personnalisé
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent {
  user$!: Observable<User | null>; // Observable des informations de l'utilisateur
  editMode = false;                // Mode édition pour le formulaire

  oldPassword = '';                // Ancien mot de passe
  newPassword = '';                // Nouveau mot de passe

  // Messages de succès et d'erreur pour modification info et mot de passe
  successMessage: string = '';
  successMessagePw: string = '';
  errorMessage: string = '';
  errorMessagePw: string = '';
  isloading: boolean = false;     // Indicateur de chargement

  // Valeur locale pour édition (clone de l'utilisateur)
  userEdit!: User;

  constructor(
    private store: Store,          // Store NgRx pour récupérer/modifier les données
    private authService: AuthService, // Service d'authentification
    private usersService: UsersService // Service de gestion des utilisateurs
  ) {}

  ngOnInit() {
    // Récupérer les informations de l'utilisateur depuis le store
    this.user$ = this.store.select(selectUserInfoConnecter);

    // Initialiser userEdit avec les données du store pour édition
    this.user$.subscribe((user) => {
      if (user) this.userEdit = { ...user }; // clone pour éviter de modifier le store directement
    });
  }

  // Sauvegarde des informations de l'utilisateur
  saveUserInfo(form: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';

    // Vérification que le formulaire est valide
    if (!form.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.isloading = true;

    const data = {
      id: this.userEdit.id,
      firstname: this.userEdit.firstname,
      lastname: this.userEdit.lastname,
      email: this.userEdit.email,
      phone: this.userEdit.phone,
      address: this.userEdit.address,
    };

    // Appel au service pour mettre à jour les infos
    this.usersService.updateUserInfos(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Modification de vos information réussie !';
          // Mise à jour du store avec les nouvelles infos
          this.store.dispatch(getActiveUserInfo(response.user));
          this.store.dispatch(getActiveUserInfo(this.userEdit));
        } else {
          this.errorMessage =
            'Erreur lors de Modification de vos données, Veuillez essayer ultérieurement';
          console.log('response.message :', response.message);
        }
      },
      error: () => {
        this.errorMessage = 'Erreur de connexion au serveur';
      },
      complete: () => {
        this.isloading = false;
        this.editMode = false; // Sortie du mode édition
      },
    });
  }

  // Changement du mot de passe
  changePassword() {
    if (!this.oldPassword || !this.newPassword) {
      this.errorMessagePw = 'Veuillez remplir tous les champs';
      return;
    }

    this.isloading = true;

    // Appel au service pour changer le mot de passe
    this.authService
      .updatePassword(this.userEdit.id, this.oldPassword, this.newPassword)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessagePw = 'Mot de passe changé avec succès !';
            this.oldPassword = '';
            this.newPassword = '';
          } else {
            this.errorMessagePw =
              'Erreur lors de Modification de vos do nnées, Veuillez essayer ultérieurement';
            console.log(response.message);
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessagePw = 'Erreur lors du changement de mot de passe';
          this.isloading = false;
        },
        complete: () => {
          this.isloading = false;
        },
      });
  }
}
